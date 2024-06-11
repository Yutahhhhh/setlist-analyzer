# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    after :create, &:confirm
    id { 1 }
    uid { 'uid-master@example.com' }
    password { 'password' }
    provider { 'email' }
    encrypted_password { 'encrypted_password' }
    email { 'master@example.com' }
  end
end
