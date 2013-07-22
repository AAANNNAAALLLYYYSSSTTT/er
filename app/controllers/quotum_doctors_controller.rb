class QuotumDoctorsController < ApplicationController
  before_action :set_quotum_doctor, only: [:show, :edit, :update, :destroy]
  before_action :check_admin_ability

  # GET /quotum_doctors
  # GET /quotum_doctors.json
  def index
    @doctors = Doctor.where(status_id: 1).order(:surname)
  end

  # GET /quotum_doctors/1
  # GET /quotum_doctors/1.json
  def show
  end
 
  # GET /quotum_doctors/new
  def new
    @quotum_doctor = QuotumDoctor.new
  end

  # GET /quotum_doctors/1/edit
  def edit
  end

  # POST /quotum_doctors
  # POST /quotum_doctors.json
  def create
    respond_to do |format|
      date = get_selected_date_for_current_user
      format.html {
        if params[:quotum_doctor]
          @quotum_doctor = QuotumDoctor.new(quotum_doctor_params)

          if @quotum_doctor.save
            redirect_to @quotum_doctor
          end
        else
          @quotum_doctors = QuotumDoctor.where(year: date.year, month: date.month, day: date.day).order(:id)
          if @quotum_doctors.count == 0
            @doctors = Doctor.where(status: Status.on).order(:surname)
            render partial: 'quotum_doctors/empty_quotum_doctors'
          else
            render partial: 'quotum_doctors/edit_quotum_doctors_for_selected_date'
          end
        end
      }
      format.json {
        if params[:quotas]
          parsed_json_quotas = ActiveSupport::JSON.decode(params[:quotas])
          parsed_json_quotas.each do |quota_hash|
            doctor = Doctor.find_by_id(quota_hash['key'].to_i)

            quotum_doctor = QuotumDoctor.find_or_create_by(year: date.year, month: date.month, day: date.day, doctor: doctor)
            quotum_doctor.full = quota_hash['quota'].to_i
            quotum_doctor.currently = quota_hash['quota'].to_i
            quotum_doctor.status = quota_hash['active'] ? Status.on : Status.off
            quotum_doctor.post = doctor.post
            quotum_doctor.description = quota_hash['description']
            quotum_doctor.save
          end
          render json: { status: "Ok" }
        end
      }
    end
  end

  # PATCH/PUT /quotum_doctors/1
  # PATCH/PUT /quotum_doctors/1.json
  def update
    respond_to do |format|
      if @quotum_doctor.update(quotum_doctor_params)
        format.html { redirect_to @quotum_doctor, notice: 'Quotum doctor was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @quotum_doctor.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /quotum_doctors/1
  # DELETE /quotum_doctors/1.json
  def destroy
    @quotum_doctor.destroy
    respond_to do |format|
      format.html { redirect_to quotum_doctors_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_quotum_doctor
      @quotum_doctor = QuotumDoctor.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def quotum_doctor_params
      params.require(:quotum_doctor).permit(:full, :currently, :doctor_id, :post_id, :description, :year, :month, :day, :status_id)
    end
end
