json.array!(@accounts) do |account|
  json.extract! account, :name, :password_digest, :role_id, :description, :status_id
  json.url account_url(account, format: :json)
end
