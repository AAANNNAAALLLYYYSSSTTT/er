json.array!(@quotum_doctors) do |quotum_doctor|
  json.extract! quotum_doctor, :full, :currently, :doctor_id, :post_id, :description, :year, :month, :day, :status_id
  json.url quotum_doctor_url(quotum_doctor, format: :json)
end
