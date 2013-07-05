class DateController < ApplicationController

  before_action :check_authorize

  def create
    $redis.hset session[:account_id], :year, params[:year]
    $redis.hset session[:account_id], :month, params[:month]
    $redis.hset session[:account_id], :day, params[:day]

    render text: Time.new(params[:year], params[:month], params[:day]).strftime("%F")
  end

end