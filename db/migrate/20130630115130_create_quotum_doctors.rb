class CreateQuotumDoctors < ActiveRecord::Migration
  def change
    create_table :quotum_doctors do |t|
      t.integer :full, null: false
      t.integer :currently, null: false
      t.integer :doctor_id, null: false
      t.integer :post_id, null: false
      t.text :description
      t.integer :year, null: false
      t.integer :month, null: false
      t.integer :day, null: false
      t.integer :status_id, null: false

      t.timestamps
    end
  end
end
