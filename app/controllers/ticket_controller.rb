class TicketController < ApplicationController
  before_action :check_authorize
  protect_from_forgery only: :index

  def index
    respond_to do |format|
      format.html { render layout: false }
    end
  end

  def show
  end

end
