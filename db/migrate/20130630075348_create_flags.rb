class CreateFlags < ActiveRecord::Migration
  def change
    create_table :flags do |t|
      t.text :name, null: false
      t.text :description

      t.timestamps
    end
  end
end
