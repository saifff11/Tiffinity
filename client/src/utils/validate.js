export const validateRegister = (formData) => {
  if (!formData.name.trim()) return 'Name is required'
  if (formData.name.trim().length < 2) return 'Name must be at least 2 characters'
  if (!formData.email.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Enter a valid email'
  if (!formData.password) return 'Password is required'
  if (formData.password.length < 6) return 'Password must be at least 6 characters'
  if (!formData.city.trim()) return 'City is required'
  return null
}

export const validateLogin = (formData) => {
  if (!formData.email.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Enter a valid email'
  if (!formData.password) return 'Password is required'
  return null
}

export const validateCookProfile = (formData) => {
  if (!formData.bio.trim()) return 'Bio is required'
  if (formData.bio.trim().length < 10) return 'Bio must be at least 10 characters'
  if (!formData.cuisineType.trim()) return 'Cuisine type is required'
  if (!formData.city.trim()) return 'City is required'
  if (!formData.address.trim()) return 'Address is required'
  return null
}

export const validateOrder = (deliveryAddress) => {
  if (!deliveryAddress.trim()) return 'Delivery address is required'
  if (deliveryAddress.trim().length < 10) return 'Please enter a complete address'
  return null
}

export const validateReview = (rating) => {
  if (!rating) return 'Please select a rating'
  if (rating < 1 || rating > 5) return 'Rating must be between 1 and 5'
  return null
}

export const validateMenu = (dishes, cutoffTime) => {
  if (!cutoffTime) return 'Cutoff time is required'
  for (let i = 0; i < dishes.length; i++) {
    if (!dishes[i].name.trim()) return `Dish ${i + 1} name is required`
    if (!dishes[i].price || isNaN(dishes[i].price) || Number(dishes[i].price) <= 0) return `Dish ${i + 1} price must be a valid number greater than 0`
    if (!dishes[i].maxPortions || isNaN(dishes[i].maxPortions) || Number(dishes[i].maxPortions) <= 0) return `Dish ${i + 1} portions must be a valid number greater than 0`
  }
  return null
}