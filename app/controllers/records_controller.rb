class RecordsController < ApplicationController
  before_action :check_receptionist_ability

  # GET /records
  # GET /records.json
  def index
    @posts = Post.order(:name)
    @doctors = Doctor.order(:surname)
  end

  # POST /records/1
  # POST /records/1.json
  def show
    flag_awaiting = Flag.find_by_id(2)
    respond_to do |format|
      date = get_selected_date_for_current_user
      format.html {
        @records = Record.where(year: date.year, month: date.month, day: date.day, flag: flag_awaiting).order(:account_id)
        render partial: 'records/show_records_for_selected_date'
      }
    end
  end

  # PATCH/PUT /records/1
  # PATCH/PUT /records/1.json
  def update
    flag_accepted = Flag.find_by_id(1)
    date = get_selected_date_for_current_user
    parsed_json_record = ActiveSupport::JSON.decode(params[:record])
    parsed_json_record['id'].match(/([\d]+)/)
    record_id = $1
    Record.update(record_id, flag: flag_accepted, description: 'Accepted')
    result_update = { success: { id: record_id, info: 'Record was successfully updated.' } }
  rescue => error
    result_update = { error: { info: error } }
  ensure
    respond_to do |format|
      format.json { render json: result_update }
    end
  end

  # DELETE /records/1
  # DELETE /records/1.json
  def destroy
    flag_rejected = Flag.find_by_id(3)
    date = get_selected_date_for_current_user
    parsed_json_record = ActiveSupport::JSON.decode(params[:record])
    parsed_json_record['id'].match(/([\d]+)/)
    record_id = $1
    Record.update(record_id, flag: flag_rejected, description: parsed_json_record['description'])
    result_destroy = { success: { id: record_id, info: 'Deleting the record' } }
  rescue => error
    result_destroy = { error: { info: error } }
  ensure
    respond_to do |format|
      format.json { render json: result_destroy }
    end
  end

end
