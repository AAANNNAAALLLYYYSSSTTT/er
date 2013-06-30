json.array!(@flags) do |flag|
  json.extract! flag, :name, :description
  json.url flag_url(flag, format: :json)
end
