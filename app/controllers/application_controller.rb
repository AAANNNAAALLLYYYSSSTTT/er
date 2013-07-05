class ApplicationController < ActionController::Base
  before_action :check_authorize

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  private
    def logged_in?
      not session[:account_id].nil?
    end

    def current_account
      current_user ||= Account.find_by_id(session[:account_id]) if logged_in?
    end

    def is_current_account_roles? roles
      roles.include? current_account.role.name.to_sym
    end

    def get_selected_date_for_current_user
      year = $redis.hget session[:account_id], :year
      month = $redis.hget session[:account_id], :month
      day = $redis.hget session[:account_id], :day
      Time.new(year, month, day)
    end

  protected
    def check_authorize
      redirect_to login_url, alert: "Not authorized." unless Account.find_by_id(session[:account_id])
    end

    def check_admin_ability
      redirect_to login_url, alert: "Not authorized." unless is_current_account_roles? [:admin]
    end

    def check_user_ability
      redirect_to login_url, alert: "Not authorized." unless is_current_account_roles? [:admin, :user]
    end

    def check_receptionist_ability
       redirect_to login_url, alert: "Not authorized." unless is_current_account_roles? [:admin, :receptionist]
    end

end
