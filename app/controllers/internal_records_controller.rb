class InternalRecordsController < ApplicationController
  before_action :check_receptionist_ability

  # GET /internal_records
  def index
    @posts = Post.order(:name)
    @doctors = Doctor.order(:surname)
  end

  # POST /quotum_doctors
  # POST /quotum_doctors.json
  def create
    respond_to do |format|
      date = get_selected_date_for_current_user
      flag_accepted = Flag.find_by_id(1)
      format.html {
        role_receptionist = Role.find_by_id(3)
        @doctor = Doctor.find_by_id(params['key'].to_i)
        quotum_doctor = QuotumDoctor.where(year: date.year, month: date.month, day: date.day, doctor: @doctor).first
        @records = Record.where(year: date.year, month: date.month, day: date.day, doctor: @doctor, flag: flag_accepted)
        @empty_records_count = quotum_doctor ? quotum_doctor.full - @records.count : 0
        @external_records = []
        @internal_records = []
        @records.each do |record|
          if record.account.role = role_receptionist
            @internal_records << record
          else
            @external_records << record
          end
        end
        render :layout => false, template: 'internal_records/_edit_internal_records_for_selected_date'
      }
      format.json {
        parsed_json_records = ActiveSupport::JSON.decode(params[:records])
        doctor = Doctor.find_by_id(parsed_json_records['doctor'].to_i)
        account = Account.find(current_account)
        Record.where(year: date.year, month: date.month, day: date.day, doctor: doctor).delete_all
        parsed_json_records['list'].each do |record_hash|
          next if record_hash['write'].empty?
          record = Record.new
          record.account = account
          record.surname = 'none'
          record.name = 'none'
          record.card = 'none'
          record.doctor = doctor
          record.description = record_hash['write']
          record.year = date.year
          record.month = date.month
          record.day = date.day
          record.flag = flag_accepted
          record.save
        end
        render json: {status: "Ok"}
      }
    end
  end
end
