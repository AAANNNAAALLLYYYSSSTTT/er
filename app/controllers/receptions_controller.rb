require 'calendar'

class ReceptionsController < ApplicationController
  before_action :check_authorize

  def index
    render :layout => 'receptions'
  end

  def create
    if request.get?
      render :layout => 'receptions'
    elsif request.post?
      if params[:command]
        if params[:command] == 'auth'
          case params[:type]
          when 'verification'
            keep_patient_info params
            render_verification and return
          else
            render_auth_form and return
          end
        elsif params[:command] == 'next'
          if params[:type] == 'profile'
            keep_selected_post
            render_lpu_choise and return
          end
          if params[:type] == 'lpu'
            render_doctors_choise and return
          end
          if params[:type] == 'doctor'
            keep_selected_doctor
            render_schedule_of_doctor and return
          end
          if params[:type] == 'time'
            render_confirm_form and return
          end
          if params[:type] == 'auth'
            save_request_visit_to_doctor
            render_info_result_save_request_visit_to_doctor and return
          end
        elsif params[:command] == 'back'
          if params[:type] == 'doctor'
            if params[:profile_id]
              render_lpu_choise and return
            end
          end
          if params[:type] == 'time'
            if params[:profile_id]
              render_doctors_choise and return
            end
          end
          if params[:type] == 'lpu'
            if params[:profile_id]
              render_posts_choise and return
            end
          end
          if params[:type] == 'auth'
            render_schedule_of_doctor and return
          end
        elsif params[:command] == 'info'
          if params[:type] == 'profile'
            render_info_post and return
          end
          if params[:type] == 'doctor'
            render_info_doctor and return
          end
          if params[:type] == 'lpu'
            render_info_lpu and return
          end
          if params[:type] == 'time'
            if params[:subtype] == 'day'
              keep_selected_date
              render_time_choise and return
            end
            if params[:subtype] == 'month'
              keep_selected_date
              render_month_choise and return
            end
          end
        elsif params[:command] == 'filter'
          if params[:type] == 'profile'
            render_posts_filter and return
          end
          if params[:type] == 'lpu'
            render_lpu_filter and return
          end
          if params[:type] == 'doctor'
            render_doctors_filter and return
          end
        end
      else
        if params[:type] == 'profile'
          render_posts_choise and return
        end
      end
    end
  end

  def render_verification
    check = true
    check = false unless surname
    check = false unless name
    check = false unless patronymic
    check = false unless card

    verification_json = if check
                          { personal_agreement_signed: true, lpu_way: false, patient_fio: patient_fio, id: 1, success: true, personal_agreement: false }
                        else
                          { captcha_key: '', captcha_url: '', messages: ["\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440 \u043f\u0430\u0441\u043f\u043e\u0440\u0442\u0430 (\u0441\u0432\u0438\u0434\u0435\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u043e \u0440\u043e\u0436\u0434\u0435\u043d\u0438\u0438)", "\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440 \u043f\u043e\u043b\u0438\u0441\u0430 \u041e\u041c\u0421"], success: false }
                        end
    respond_to do |format|
      format.json { render json: verification_json }
    end
  end
    
  def render_auth_form
    respond_to do |format|
      format.html { render partial: 'receptions/auth_form' }
    end
  end

  def render_next_time
    next_time_json = { success: true, date: short_date, time: '08:00', shedule_id: 9 }
    respond_to do |format|
      format.json { render json: next_time_json }
    end
  end

  def render_posts_choise
    status_on = Status.find_by_id(1)
    @posts = Post.where(status: status_on).order(:name)
    respond_to do |format|
      format.html { render partial: 'receptions/posts_choise' }
    end
  end

  def render_lpu_choise
    respond_to do |format|
      format.html { render partial: 'receptions/lpu_choise' }
    end
  end

  def render_doctors_choise
    status_on = Status.find_by_id(1)
    @doctors = Doctor.where(status: status_on, post_id: post).order(:surname)
    respond_to do |format|
      format.html { render partial: 'receptions/doctors_choise' }
    end
  end

  def render_schedule_of_doctor
    date_now = Time.now
    calendar = Calendar.new
    @account = Account.find_by_id(session[:account_id])
    @doctor_selected = Doctor.find_by_id(doctor)
    @status_days = quotum_of_doctor
    @month_days = calendar.monthdays_calendar date_now.year, date_now.month
    respond_to do |format|
      format.html { render partial: 'receptions/schedule_of_doctor' }
    end
  end

  def render_month_choise
    cost = ""
    calendar = Calendar.new
    @status_days = quotum_of_doctor
    @month_days = calendar.monthdays_calendar year, month
    with_format :html do
      @html_content = render_to_string partial: 'receptions/month_choise'
    end
    respond_to do |format|
      format.json { render partial: 'receptions/month_choise', locals: { html_content: @html_content, cost: cost } }
    end
  end

  def render_time_choise
    cost = ""
    strategy = 0
    with_format :html do
      @html_content = render_to_string partial: 'receptions/time_choise'
    end
    respond_to do |format|
      format.json { render partial: 'receptions/time_choise', locals: { html_content: @html_content, cost: cost, strategy: strategy } }
    end
  end

  def render_confirm_form
    respond_to do |format|
      format.html { render partial: 'receptions/confirm_form' }
    end
  end

  def render_info_result_save_request_visit_to_doctor
    wf_id = 0
    phone = "279-03-97"
    respond_to do |format|
      format.json { render json: { wf_id: wf_id, phone: phone, success: true } }
    end
  end

  def render_info_post
    post_id = params[:id]
    @post = Post.find_by_id(post_id)
    respond_to do |format|
      format.html { render partial: 'receptions/info_post' }
    end
  end

  def render_info_doctor
    doctor_id = params[:id]
    @doctor = Doctor.find_by_id(doctor_id)
    respond_to do |format|
      format.html { render partial: 'receptions/info_doctor' }
    end
  end

  def render_info_lpu
    respond_to do |format|
      format.html { render partial: 'receptions/info_lpu' }
    end
  end

  def render_posts_filter
    if params[:value].empty?
      @posts = Post.order(:name)
    else
      @posts = Post.where("lower(name) like ?", "%#{params[:value].downcase}%").order(:name)
    end
    respond_to do |format|
      format.html { render partial: 'receptions/posts_filter' }
    end
  end

  def render_lpu_filter
    respond_to do |format|
      format.html { render partial: 'receptions/lpu_filter' }
    end
  end

  def render_doctors_filter
    if params[:value].empty?
      @doctors = doctor.order(:surname)
    else
      @doctors = Doctor.where(post_id: post).where("lower(surname) like ? OR lower(name) like ?", "%#{params[:value].downcase}%", "%#{params[:value].downcase}%").order(:surname)
    end
    respond_to do |format|
      format.html { render partial: 'receptions/doctors_filter' }
    end
  end

  private
    def year()       $redis.hget session[:account_id], :year       end
    def month()      $redis.hget session[:account_id], :month      end
    def day()        $redis.hget session[:account_id], :day        end
    def card()       $redis.hget session[:account_id], :card       end
    def patronymic() $redis.hget session[:account_id], :patronymic end
    def surname()    $redis.hget session[:account_id], :surname    end
    def name()       $redis.hget session[:account_id], :name       end
    def post()       $redis.hget session[:account_id], :post       end
    def doctor()     $redis.hget session[:account_id], :doctor     end

    def keep_selected_date
      $redis.hset(session[:account_id], :year,  params[:year])  if params[:year]
      $redis.hset(session[:account_id], :month, params[:month]) if params[:month]
      $redis.hset(session[:account_id], :day,   params[:day])   if params[:day]
    end

    def keep_selected_post
      $redis.hset(session[:account_id], :post, params[:profile_id]) if params[:profile_id]
    end

    def keep_selected_doctor
      $redis.hset(session[:account_id], :doctor, params[:doctor_id]) if params[:doctor_id]
    end

    def keep_patient_info params
      $redis.hset(session[:account_id], :surname,    params[:num_passport])   if params[:num_passport]
      $redis.hset(session[:account_id], :name,       params[:telephone])      if params[:telephone]
      $redis.hset(session[:account_id], :patronymic, params[:email])          if params[:email]
      $redis.hset(session[:account_id], :card,       params[:num_med_policy]) if params[:num_med_policy]
    end

    def short_date
      year  = $redis.hget session[:account_id], :year
      month = $redis.hget session[:account_id], :month
      day   = $redis.hget session[:account_id], :day

      Time.new(year, month, day).strftime("%F")
    end

    def patient_fio
      full_surname = surname if surname and surname.size > 1
      first_char_of_name = name[0] + "." if name and name.size > 1
      first_char_of_patronymic = patronymic[0] + "." if patronymic and patronymic.size > 1
      "%s %s. %s." % [full_surname, first_char_of_name, first_char_of_patronymic]
    end

    def quotum_of_doctor
      calendar = Calendar.new
      days = []
      days[0] = nil
      (1..calendar.count_days(year, month)).each do |i|
        days[i] = false
        quota = QuotumDoctor.where(doctor_id: doctor, year: year, month: month, day: i).first
        if quota and quota.currently > 0
          days[i] = true
        end
      end
      days
    end

    def save_request_visit_to_doctor
      flag_awaiting = Flag.find_by_id(2)
      record = Record.new
      record.account_id = session[:account_id]
      record.surname = surname
      record.name = name
      record.patronymic = patronymic if patronymic
      record.card = card
      record.doctor_id = doctor
      record.description = 'In list request'
      record.year = year
      record.month = month
      record.day = day
      record.flag = flag_awaiting
      record.save
    end

    def with_format(format, &block)
      old_formats = formats
      begin
        self.formats = [format]
        return block.call
      ensure
        self.formats = old_formats
      end
    end

end
