json.array!(@doctors) do |doctor|
  json.extract! doctor, :surname, :name, :patronymic, :post_id, :cabinet, :description, :status_id
  json.url doctor_url(doctor, format: :json)
end
