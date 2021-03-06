# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20130630115130) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: true do |t|
    t.text     "name",            null: false
    t.text     "password_digest", null: false
    t.integer  "role_id",         null: false
    t.text     "description"
    t.integer  "status_id",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "doctors", force: true do |t|
    t.text     "surname",     null: false
    t.text     "name",        null: false
    t.text     "patronymic"
    t.integer  "post_id",     null: false
    t.text     "cabinet"
    t.text     "description"
    t.integer  "status_id",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "flags", force: true do |t|
    t.text     "name",        null: false
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "posts", force: true do |t|
    t.text     "name",        null: false
    t.text     "description"
    t.integer  "status_id",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "quotum_doctors", force: true do |t|
    t.integer  "full",        null: false
    t.integer  "currently",   null: false
    t.integer  "doctor_id",   null: false
    t.integer  "post_id",     null: false
    t.text     "description"
    t.integer  "year",        null: false
    t.integer  "month",       null: false
    t.integer  "day",         null: false
    t.integer  "status_id",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "records", force: true do |t|
    t.integer  "account_id",  null: false
    t.text     "surname",     null: false
    t.text     "name",        null: false
    t.text     "patronymic"
    t.text     "card",        null: false
    t.integer  "doctor_id",   null: false
    t.text     "description"
    t.integer  "year",        null: false
    t.integer  "month",       null: false
    t.integer  "day",         null: false
    t.integer  "hour"
    t.integer  "minute"
    t.integer  "flag_id",     null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", force: true do |t|
    t.text     "name",        null: false
    t.text     "description"
    t.integer  "status_id",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "statuses", force: true do |t|
    t.text     "name",        null: false
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
