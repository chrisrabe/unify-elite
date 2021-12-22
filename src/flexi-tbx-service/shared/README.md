# Shared layer guides

## Changes required when introducing new products

### data-models directory

- Add a new product code in shared.ts
- In tbxAPIModels, add new product details under `products/details` (create a new file and add it into index.ts)
- In elasticModels, add a new product under `itinerary/products` (create a new file and add it into index.ts). Reuse the generic product components as much as possible

### mappers directory

- Add a new mapping function for your new product. Reuse the generic product component mappers as much as possible

## Changes required to a new data model

- Define a new data model
- Define validation functions for the data model
- Using the validation functions, create a new validation rule
- Using the validation rules, create a new validation model
- Using the validation model, define a new validator

## Changes required when adding a new validation check

- Create a new validation function associated with the data model you wish to validate
- Add the new validation into the validation function
