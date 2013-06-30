json.array!(@roles) do |role|
  json.extract! role, :name, :description, :status_id
  json.url role_url(role, format: :json)
end
