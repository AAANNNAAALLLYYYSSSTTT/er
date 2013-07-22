class InternalRecordsController < ApplicationController
  before_action :check_receptionist_ability

  # GET /internal_records
  def index
    @posts = Post.order(:name)
    @doctors = Doctor.where(status: Status.on).order(:surname)
  end

  # POST /internal_records
  # POST /internal_records.json
  def create
    respond_to do |format|
      date = get_selected_date_for_current_user
      format.html {
        @doctor = Doctor.find_by_id(params['key'])
        quotum_doctor = QuotumDoctor.where(year: date.year, month: date.month, day: date.day, doctor: @doctor, status: Status.on).first
        @records = Record.where(year: date.year, month: date.month, day: date.day, doctor: @doctor, flag: Flag.accepted)
        @empty_records_count = quotum_doctor ? quotum_doctor.full - @records.count : 0
        @external_records = []
        @internal_records = []
        @records.each do |record|
          if record.account.role == Role.receptionist
            @internal_records << record
          else
            @external_records << record
          end
        end
        render partial: 'internal_records/edit_internal_records_for_selected_date'
      }
      format.json {
        account_receptionist = Account.find_by_id(Account::GENERAL_RECEPTIONIST_ID)
        parsed_json_records = ActiveSupport::JSON.decode(params[:records])
        doctor = Doctor.find_by_id(parsed_json_records['doctor'])
        records = Record.where(year: date.year, month: date.month, day: date.day, doctor: doctor)
        records.each { |record| record.delete if record.account.role == Role.receptionist }
        parsed_json_records['list'].each do |record_hash|
          next if record_hash['write'].empty?
          record = Record.new
          record.account = account_receptionist
          record.surname = 'none'
          record.name = 'none'
          record.card = 'none'
          record.doctor = doctor
          record.description = record_hash['write']
          record.year = date.year
          record.month = date.month
          record.day = date.day
          record.flag = Flag.accepted
          record.save
        end
        render json: { status: "Ok" }
      }
    end
  end
end
