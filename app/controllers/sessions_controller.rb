class SessionsController < ApplicationController
  skip_before_action :check_authorize

  def new
  end

  def create
    account = Account.find_by_name(params[:name])
    if account and account.authenticate(params[:password])
      session[:account_id] = account.id
      $redis.hset account.id, :name, account.name
      $redis.hset account.id, :description, account.description
      $redis.hdel account.id, :time_logout
      $redis.hset account.id, :time_login, Time.now.to_i
      redirect_after_successful_authenticate account
    else
      redirect_to login_url, alert: 'Not authorized.'
    end
  end

  def destroy
    $redis.hset session[:account_id], :time_logout, Time.now.to_i
    session[:account_id] = nil
  end

  private
    def redirect_after_successful_authenticate user
      case user.role.name
        when 'admin' then redirect_to internal_records_url
        when 'user' then redirect_to external_records_url
        else redirect_to login_url
      end
    end

end
