# frozen_string_literal: true

Rails.application.routes.draw do
  match '*path' => 'pre_flight#handle_pre_flight', via: :options

  namespace :api do
    mount ActionCable.server => '/cable'

    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      sessions: 'api/auth/sessions'
    }

    resources :audios, only: [:index]
    resources :genre_trains, only: [:create]
    resources :job_statuses, only: [:index]
    resources :tracks, only: [:index] do
      post :analyze, on: :collection
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # 音楽ファイル取得用
  get 'audios/find_audio', to: 'audios#find_audio'

  # Defines the root path route ("/")
  # root "posts#index"
end
