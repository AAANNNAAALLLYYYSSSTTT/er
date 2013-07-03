class ApplicationController < ActionController::Base
  before_action :check_authorize

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  protected
    def check_authorize
      redirect_to login_url, alert: "Not authorized." unless Account.find_by_id(session[:account_id])
    end

  private
    def current_account
      current_user ||= Account.find_by_id(session[:account_id]) if session[:account_id]
    end
    helper_method :current_account

end
