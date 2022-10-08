export const stockSlice = (set) => ({
  wishlist: [],
  setWishlist: (payload) => {
    localStorage.setItem('wishlist', payload?.toString())
    set({ wishlist: payload })
  },
});
