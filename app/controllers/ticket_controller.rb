class TicketController < ApplicationController
  protect_from_forgery only: :index

  def index
    respond_to do |format|
      format.html { render layout: false }
    end
  end

  def show
    flag_accepted = Flag.find_by_id(1)
    @record = Record.where(id: params[:id], account: current_account, flag: flag_accepted).first
    respond_to do |format|
      format.html { render layout: false }
    end
  end

end
