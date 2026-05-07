const STORAGE_KEY = "zoronal_companies"
const REVIEWS_STORAGE_KEY = "zoronal_reviews"

const initialCompanies = [
  {
    id: 1,
    name: "Graffersid Web and App Development",
    city: "Indore, Madhya Pradesh, India",
    address: "816, Shekhar Central, Manorama Ganj, AB Road, New Palasia, Indore (M.P.)",
    logoText: "G",
    logoBg: "bg-[#0e1c5a]",
    rating: 4.5,
    reviewsCount: 41,
    foundedOn: "01-01-2016",
    reviewIds: [1, 2],
  },
  {
    id: 2,
    name: "Code Tech Company",
    city: "Indore, Madhya Pradesh, India",
    address: "414, Kanha Appartment, Bhawarkua, Indore (M.P.)",
    logoText: "<CT>",
    logoBg: "bg-[#2f8f1d]",
    rating: 4.5,
    reviewsCount: 30,
    foundedOn: "01-01-2016",
    reviewIds: [3],
  },
  {
    id: 3,
    name: "Innogent Pvt. Ltd.",
    city: "Indore, Madhya Pradesh, India",
    address: "910, Shekhar Central, Manorama Ganj, AB Road, New Palasia, Indore (M.P.)",
    logoText: "i",
    logoBg: "bg-[#f59f1a]",
    rating: 4.5,
    reviewsCount: 20,
    foundedOn: "01-01-2016",
    reviewIds: [4],
  },
]

const reviewsById = {
  1: {
    id: 1,
    companyId: 1,
    userName: "Jorque Watson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop",
    rating: 4,
    date: "01-01-2022, 14:33",
    content:
      "Graffersid one of the best company. Team communication and support are very good and they always deliver quality work on time.",
  },
  2: {
    id: 2,
    companyId: 1,
    userName: "Jenny Kole",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop",
    rating: 4,
    date: "12-01-2022, 15:00",
    content:
      "Professional team and smooth process. They understood requirements quickly and gave helpful suggestions during development.",
  },
  3: {
    id: 3,
    companyId: 2,
    userName: "Aman Raj",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=128&auto=format&fit=crop",
    rating: 5,
    date: "02-02-2022, 11:20",
    content: "Good management, clear planning, and timely delivery.",
  },
  4: {
    id: 4,
    companyId: 3,
    userName: "Priya S",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&auto=format&fit=crop",
    rating: 4,
    date: "10-02-2022, 10:10",
    content: "Creative team with strong UI and branding ideas.",
  },
}

const initialReviews = Object.values(reviewsById)

const getStoredCompanies = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return initialCompanies

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : initialCompanies
  } catch {
    return initialCompanies
  }
}

const persistCompanies = (companies) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies))
}

const getStoredReviews = () => {
  const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)
  if (!raw) return initialReviews

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : initialReviews
  } catch {
    return initialReviews
  }
}

const persistReviews = (reviews) => {
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
}

export const getAllCompanies = () => getStoredCompanies()

export const addCompany = (formData) => {
  const companies = getStoredCompanies()
  const nextId = companies.reduce((maxId, company) => Math.max(maxId, company.id), 0) + 1

  const newCompany = {
    id: nextId,
    name: formData.name.trim(),
    city: formData.city.trim(),
    address: formData.address.trim(),
    logoText: (formData.logoText || formData.name.slice(0, 1) || "C").trim(),
    logoBg: "bg-[#6d28d9]",
    rating: Number(formData.rating) || 4.0,
    reviewsCount: 0,
    foundedOn: formData.foundedOn.trim(),
    reviewIds: [],
  }

  const updatedCompanies = [newCompany, ...companies]
  persistCompanies(updatedCompanies)
  return newCompany
}

export const getCompanyById = (id) => {
  const companyId = Number(id)
  const companies = getStoredCompanies()
  return companies.find((company) => company.id === companyId) ?? null
}

export const getReviewsForCompany = (company) => {
  if (!company) return []
  return getStoredReviews().filter((review) => review.companyId === company.id)
}

export const addReview = (companyId, formData) => {
  const reviews = getStoredReviews()
  const nextReviewId = reviews.reduce((maxId, review) => Math.max(maxId, review.id), 0) + 1

  const newReview = {
    id: nextReviewId,
    companyId,
    userName: formData.userName.trim(),
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop",
    rating: Number(formData.rating) || 4,
    date: new Date().toLocaleDateString("en-GB"),
    content: formData.content.trim(),
  }

  persistReviews([newReview, ...reviews])

  const companies = getStoredCompanies()
  const companyReviews = [newReview, ...reviews.filter((review) => review.companyId === companyId)]
  const totalRating = companyReviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = companyReviews.length ? totalRating / companyReviews.length : 0

  const updatedCompanies = companies.map((company) =>
    company.id === companyId
      ? {
          ...company,
          rating: Number(averageRating.toFixed(1)),
          reviewsCount: companyReviews.length,
        }
      : company
  )

  persistCompanies(updatedCompanies)
  return newReview
}
