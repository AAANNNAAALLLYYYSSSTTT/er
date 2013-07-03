class QuotumDoctorsController < ApplicationController
  before_action :set_quotum_doctor, only: [:show, :edit, :update, :destroy]
  before_action :check_admin_ability

  # GET /quotum_doctors
  # GET /quotum_doctors.json
  def index
    @quotum_doctors = QuotumDoctor.all
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
    @quotum_doctor = QuotumDoctor.new(quotum_doctor_params)

    respond_to do |format|
      if @quotum_doctor.save
        format.html { redirect_to @quotum_doctor, notice: 'Quotum doctor was successfully created.' }
        format.json { render action: 'show', status: :created, location: @quotum_doctor }
      else
        format.html { render action: 'new' }
        format.json { render json: @quotum_doctor.errors, status: :unprocessable_entity }
      end
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
