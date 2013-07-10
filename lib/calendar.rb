require 'date'

class Calendar

  attr_accessor :day, :month, :year

  JANUARY  = 1
  FEBRUARY = 2

  START = {
    cn: Date::GREGORIAN, # China
    de: 2342032,         # Germany (protestant states)
    dk: 2342032,         # Denmark
    es: 2299161,         # Spain
    fi: 2361390,         # Finland
    fr: 2299227,         # France
    gb: 2361222,         # United Kingdom
    gr: 2423868,         # Greece
    hu: 2301004,         # Hungary
    it: 2299161,         # Italy
    jp: Date::GREGORIAN, # Japan
    no: 2342032,         # Norway
    pl: 2299161,         # Poland
    pt: 2299161,         # Portugal
    ru: 2421639,         # Russia
    se: 2361390,         # Sweden
    us: 2361222,         # United States
    os: Date::JULIAN,    # (old style)
    ns: Date::GREGORIAN  # (new style)
  }

  DEFAULT_START = :gb

  def initialize
    @mdays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    opt_m(true); opt_t; opt_c(:ru)
  end

  def opt_m(flag=false)        @opt_m = flag       end
  def opt_t(flag=false)        @opt_t = flag       end
  def opt_c(arg=DEFAULT_START) @start = START[arg] end

  def first_weekday
    # 1 = Monday, 7 = Sunday
    firstweekday = if @opt_m then 1 else 7 end
  end

  def iter_weekdays
    # Return a iterator for one week of weekday numbers starting with the
    # configured first one.
    (first_weekday...first_weekday + 7).each do |i|
      i = (i%7 == 0) ? 7 : i%7
      yield i
    end
  end

  def parse_int value
    case value
    when Numeric
      value
    when String
      value.to_i
    else
      0
    end
  end

  def iter_monthdates(year, month)
    year = parse_int year
    month = parse_int month
    # Return an iterator for one month.
    date = Date.new(year, month, 1, @start)
    # Go back to the beginning of the week
    days = (date.cwday - first_weekday) % 7
    date -= days
    oneday = 1
    while true
      yield date
      date += oneday
      if date.month != month and date.cwday == first_weekday
        break
      end
    end
  end

  def count_days(year, month)
    year = parse_int year
    month = parse_int month
    @mdays[month] + ((month == FEBRUARY and isleap(year)) ? 2 : 0)
  end

  def monthdates_calendar(year, month)
    year = parse_int year
    month = parse_int month
    # Return a matrix (list of lists) representing a month's calendar.
    # Each row represents a week; week entries are datetime.date values.
    dates = []
    iter_monthdates(year, month) { |date| dates.push(date) }
    gr = group(dates, 7)
    gr = trans(gr) if @opt_t
    gr
  end

  def monthdays_calendar(year, month)
    year = parse_int year
    month = parse_int month
    # Return a matrix representing a month's calendar.
    # Each row represents a week; days outside this month are zero.
    days = []
    iter_monthdays(year, month) { |day| days.push(day) }
    gr = group(days, 7)
    gr = trans(gr) if @opt_t
    gr
  end

  def group(xs, n)
    (0..xs.size / n - 1).collect{ |i| xs[i * n, n] }
  end

  def trans(xs)
    (0..xs[0].size - 1).collect{ |i| xs.collect{ |x| x[i] } }
  end

  def iter_monthdays(year, month)
    year = parse_int year
    month = parse_int month
    # Like iter_monthdates, but will yield day numbers.
    iter_monthdates(year, month) do |date|
      if date.month != month
        yield 0
      else
        yield date.day
      end
    end
  end

  def isleap(year)
    year = parse_int year
    year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
  end

  def leapdays(y1, y2)
    y1 = y1.to_int
    y2 = y2.to_int
    y1 -= 1
    y2 -= 1
    (y2/4 - y1/4) - (y2/100 - y1/100) + (y2/400 - y1/400)
  end

  def weekday(year, month, day)
    year = parse_int year
    month = parse_int month
    day = parse_int day
    # Return weekday (1-7 ~ Mon-Sun)
    Date.new(year, month, day).cwday
  end

  def monthrange(year, month)
    year = parse_int year
    month = parse_int month
    # Return weekday (0-6 ~ Mon-Sun) and number of days (28-31) for
    # year, month.
    raise "Bad month number #{month}; must be 1-12" unless month >= 1 and month <= 12
    day1 = weekday(year, month, 1)
    ndays = count_days(year, month)
    { day: day1, dnay: ndays }
  end

end
