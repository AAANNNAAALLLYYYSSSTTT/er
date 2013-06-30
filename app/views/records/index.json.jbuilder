json.array!(@records) do |record|
  json.extract! record, :account_id, :surname, :name, :patronymic, :card, :doctor_id, :description, :year, :month, :day, :hour, :minute, :flag_id
  json.url record_url(record, format: :json)
end
