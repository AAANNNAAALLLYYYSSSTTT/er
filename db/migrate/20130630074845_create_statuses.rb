class CreateStatuses < ActiveRecord::Migration
  def change
    create_table :statuses do |t|
      t.text :name, null: false
      t.text :description

      t.timestamps
    end
  end
end
