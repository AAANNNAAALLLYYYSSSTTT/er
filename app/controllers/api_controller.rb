class ApiController < ApplicationController
  skip_before_action :check_authorize

  def get_records_for_date
    year  = params[:year]
    month = params[:month]
    day   = params[:day]
    records = Record.where(year: year, month: month, day: day, flag: Flag.accepted)
    @records_doctor = records.group_by { |record| record.doctor }
    respond_to do |format|
      format.xml { render partial: 'records_for_date' }
    end
  end
end
