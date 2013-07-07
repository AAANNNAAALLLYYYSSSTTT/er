require 'google/api_client'
require 'google/api_client/client_secrets'

SCOPE = 'https://www.googleapis.com/auth/userinfo.email'

class ClientSecrets < Google::APIClient::ClientSecrets
  class << self
    def load(filename=nil)
      filename_original = filename
      if filename && File.directory?(filename)
        search_path = File.expand_path(filename)
        filename = nil
      end
      while filename == nil
        search_path ||= File.expand_path('.')
        if File.exist?(File.join(search_path, 'client_secrets.yml'))
          filename = File.join(search_path, 'client_secrets.yml')
        elsif File.exist?(File.join(Rails.root, 'config','client_secrets.yml'))
          filename = File.join(Rails.root, 'config','client_secrets.yml')
        elsif search_path == '/' || search_path =~ /[a-zA-Z]:[\/\\]/
          raise ArgumentError,
              'No client_secrets.yml filename supplied ' +
              'and/or could not be found in search path.'
        else
          search_path = File.expand_path(File.join(search_path, '..'))
        end
      end
      data = YAML::load_file(filename)
      self.new(data)
    rescue ArgumentError
      super(filename_original)
    end
  end

  def initialize(options={})
    super(options)
  end
end

##
# Serializes and deserializes the token.
class TokenPair
  @refresh_token
  @access_token
  @expires_in
  @issued_at

  def update_token!(object)
    @refresh_token = object.refresh_token
    @access_token = object.access_token
    @expires_in = object.expires_in
    @issued_at = object.issued_at
  end

  def to_hash
    return {
      :refresh_token => @refresh_token,
      :access_token => @access_token,
      :expires_in => @expires_in,
      :issued_at => Time.at(@issued_at)}
  end
end

$credentials = ClientSecrets.load
$authorization = Signet::OAuth2::Client.new(
                                            :authorization_uri => $credentials.authorization_uri,
                                            :token_credential_uri => $credentials.token_credential_uri,
                                            :client_id => $credentials.client_id,
                                            :client_secret => $credentials.client_secret,
                                            :redirect_uri => $credentials.redirect_uris.first,
                                            :scope => SCOPE)
$client = Google::APIClient.new
