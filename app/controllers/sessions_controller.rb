class SessionsController < ApplicationController
  skip_before_action :check_authorize

  def new
    if logged_in?
      redirect_after_successful_authenticate
    else
      redirect_to get_target_url and return
    end
  end

  def create
  end

  def callback
    unless logged_in?
      if session[:state] == params[:state]
        $authorization.code = params[:code]
        $authorization.grant_type = 'authorization_code'
        $authorization.fetch_access_token!
        $client.authorization = $authorization
        token_pair = TokenPair.new
        token_pair.update_token!($client.authorization)
        id_token = $client.authorization.id_token
        encoded_json_body = id_token.split('.')[1]
        encoded_json_body += (['='] * (encoded_json_body.length % 4)).join('')
        json_body = Base64.decode64(encoded_json_body)
        userinfo = JSON.parse(json_body)
        account = Account.find_by_name(userinfo['email'].downcase)
        session[:account_id] = account.id
        if account
          $redis.hset session[:account_id], :id, account.id
          $redis.hset session[:account_id], :name, account.name
          $redis.hset session[:account_id], :description, account.description
          $redis.hdel session[:account_id], :time_logout
          $redis.hset session[:account_id], :time_login, Time.now.to_i
          $redis.hset session[:account_id], :code, params[:code]
        else
          render_404
        end
        session[:access_token] = token_pair
      end
    end
    redirect_to login_url and return
  end

  def destroy
    $redis.hset session[:account_id], :time_logout, Time.now.to_i
    session[:access_token] = nil
    session[:account_id] = nil
  end

  def render_404
    respond_to do |format|
      format.html { render :file => "#{Rails.root}/public/404", :layout => false, :status => :not_found }
      format.xml  { head :not_found }
      format.any  { head :not_found }
    end
  end

  private
    def redirect_after_successful_authenticate
      redirect_to internal_records_url and return if is_current_account_roles? [:admin, :receptionist]
      redirect_to external_records_url and return if is_current_account_roles? [:user]
      redirect_to login_url and return
    end

    def get_target_url
      if !session[:state]
        state = (0...13).map{('a'..'z').to_a[rand(26)]}.join
        session[:state] = state
      end
      state = session[:state]
      $credentials.authorization_uri + '?' + URI.encode_www_form({
                                                                   scope: $authorization.scope.join(' '),
                                                                   state: state,
                                                                   redirect_uri: $credentials.redirect_uris.first,
                                                                   response_type: 'code',
                                                                   client_id: $credentials.client_id
                                                                 })
    end

end
