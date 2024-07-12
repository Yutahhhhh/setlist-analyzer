# frozen_string_literal: true

module Api
  class SetlistsController < Api::ApplicationController
    before_action :set_setlist, only: %i[update destroy]

    def index
      setlists = current_user.setlists.includes(:tracks)
      render json: SetlistBlueprint.render(setlists, view: :list)
    end

    def create
      setlist = current_user.setlists.create!(setlist_params)
      render json: SetlistBlueprint.render(setlist, view: :show), status: :created
    end

    def update
      @setlist.update!(setlist_params)
      render json: SetlistBlueprint.render(@setlist, view: :show)
    end

    def destroy
      @setlist.destroy
      render json: {}, status: :ok
    end

    private

    def set_setlist
      @setlist = current_user.setlists.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Setlist not found" }, status: :not_found
    end

    def setlist_params
      params.require(:setlist).permit(:name, :genre_name, :rating, track_ids: [])
    end
  end
end
