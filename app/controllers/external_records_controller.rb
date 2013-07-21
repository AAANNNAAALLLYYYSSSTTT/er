class ExternalRecordsController < ApplicationController
  before_action :check_user_ability

  # GET /external_records
  def index
    @posts = Post.order(:name)
    @doctors = Doctor.order(:surname)
    render :layout => 'cabinet'
  end

  # POST /external_records
  # POST /external_records.json
  def show
    keep_selected_date
    respond_to do |format|
      date = get_selected_date_for_current_user
      format.html {
        @records = Record.where(account: current_account, year: date.year, month: date.month, day: date.day)
        render partial: 'external_records/edit_external_records_for_selected_date', locals: { accepted: Flag.accepted, awaiting: Flag.awaiting, rejected: Flag.rejected }
      }
    end
  end

  # DELETE /external_records/1
  # DELETE /external_records/1.json
  def destroy
    params[:id].match(/([\d]+)/)
    record_id = $1
    Record.update(record_id, flag: Flag.rejected, description: 'Removed by the user')
    result_destroy = { success: { id: record_id, info: 'Deleting the record' } }
  rescue => error
    result_destroy = { error: { info: error } }
  ensure
    respond_to do |format|
      format.json { render json: result_destroy }
    end
  end

  private
    def keep_selected_date
      $redis.hset(session[:account], :year,  params[:year])  if params[:year]
      $redis.hset(session[:account], :month, params[:month]) if params[:month]
      $redis.hset(session[:account], :day,   params[:day])   if params[:day]
    end

end
