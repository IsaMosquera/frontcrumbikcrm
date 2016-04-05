Rails.application.routes.draw do
  root 'home#home'

  get 'login' => 'home#login'

  get 'register' => 'home#register'

  get 'payservice' => 'home#payservice'

  get 'payservicestdc' => 'home#payservicestdc'

  get 'payservicetdb' => 'home#payservicetdb'

  get 'organizationpay' => 'home#organizationpay'

  get 'indexEPA' => 'home#indexEPA'

  get 'indexPOLAR' => 'home#indexPOLAR'


namespace :front do

 get 'organization' => 'adminorganization#organization'

 get 'activity' => 'adminorganization#activity'

 get 'campaing' => 'adminorganization#campaing'

 get 'city' => 'adminorganization#city'

 get 'contract' => 'adminorganization#contract'

 get 'country' => 'adminorganization#country'

 get 'customer' => 'adminorganization#customer'

 get 'operator' => 'adminorganization#operator'

 get 'pagotarjeta' => 'adminorganization#pagotarjeta'

 get 'paymentmethod' => 'adminorganization#paymentmethod'

 get 'payservice' => 'adminorganization#payservice'

 get 'payservicestdc' => 'adminorganization#payservicestdc'

 get 'payservicetdb' => 'adminorganization#payservicetdb'

 get 'planservice' => 'adminorganization#planservice'

 get 'planservice' => 'adminorganization#planservice'

 get 'product' => 'adminorganization#product'

 get 'rol' => 'adminorganization#rol'

 get 'service' => 'adminorganization#service'

 get 'socialmedia' => 'adminorganization#socialmedia'

 get 'state' => 'adminorganization#state'

 get 'homework'  => 'adminorganization#homework'


 get 'indexCrumbik' => 'adminorganization#indexCrumbik'
 
 get 'indexOrganization' => 'adminorganization#indexOrganization'

 get 'menuoption' => 'adminorganization#menuoption'

 get 'userrol' => 'adminorganization#userrol'

  
 

end
  get 'organizationall' => 'organization#getOrganization'



  namespace :api do
    resources :organization, format: :json
  end

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
