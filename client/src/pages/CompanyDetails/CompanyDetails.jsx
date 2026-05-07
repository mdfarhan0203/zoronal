import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "@/services/api"
import { useAuth } from "@/context/AuthContext"

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating)
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < fullStars ? "text-yellow-400" : "text-yellow-200"}>
          ★
        </span>
      ))}
    </div>
  )
}

const CompanyDetails = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ userName: "", rating: "4", content: "" })
  const [company, setCompany] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const loadCompanyData = async () => {
    try {
      setLoading(true)
      setError("")
      const [companyResponse, reviewsResponse] = await Promise.all([
        api.getCompany(id),
        api.getCompanyReviews(id),
      ])
      setCompany(companyResponse.data)
      setReviews(reviewsResponse.data || [])
    } catch (err) {
      setError(err.message || "Failed to load company details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanyData()
  }, [id])

  const foundedOn = useMemo(() => {
    if (!company?.createdAt) return "N/A"
    return new Date(company.createdAt).toLocaleDateString("en-GB")
  }, [company])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-lg font-medium">Loading company details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-lg font-medium text-red-700">{error}</p>
        <Link className="mt-4 inline-block text-violet-600 hover:underline" to="/">
          Back to home
        </Link>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-lg font-medium">Company not found.</p>
        <Link className="mt-4 inline-block text-violet-600 hover:underline" to="/">
          Back to home
        </Link>
      </div>
    )
  }

  const handleReviewSubmit = async (event) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      await api.createCompanyReview(company._id, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.content,
        title: `Review by ${reviewForm.userName.trim()}`,
      })
      setReviewForm({ userName: "", rating: "4", content: "" })
      setShowReviewForm(false)
      await loadCompanyData()
    } catch (err) {
      setError(err.message || "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 md:py-10">
      <div className="mx-auto max-w-5xl rounded-xl border bg-white p-4 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-violet-600 text-2xl font-bold text-white">
              {company.logoText || company.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{company.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{company.city}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="font-semibold">{Number(company.rating || 0).toFixed(1)}</span>
                <RatingStars rating={Number(company.rating || 0)} />
                <span className="font-medium">{company.reviewsCount || 0} Reviews</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Founded on {foundedOn}</p>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => setShowReviewForm((prev) => !prev)} disabled={!isAuthenticated}>
              + Add Review
            </Button>
          </div>
        </div>

        {showReviewForm && (
          <form className="mt-5 rounded-lg border p-4" onSubmit={handleReviewSubmit}>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                required
                placeholder="Full name"
                value={reviewForm.userName}
                onChange={(event) => setReviewForm((prev) => ({ ...prev, userName: event.target.value }))}
                className="rounded-md border px-3 py-2 text-sm"
              />
              <input
                required
                type="number"
                min="1"
                max="5"
                step="1"
                placeholder="Rating"
                value={reviewForm.rating}
                onChange={(event) => setReviewForm((prev) => ({ ...prev, rating: event.target.value }))}
                className="rounded-md border px-3 py-2 text-sm"
              />
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
            <textarea
              required
              placeholder="Write your review"
              value={reviewForm.content}
              onChange={(event) => setReviewForm((prev) => ({ ...prev, content: event.target.value }))}
              className="mt-3 min-h-24 w-full rounded-md border px-3 py-2 text-sm"
            />
          </form>
        )}

        <p className="mt-6 text-sm text-muted-foreground">Result Found {reviews.length}</p>

        <div className="mt-4 space-y-6">
          {reviews.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">No reviews added yet.</div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-5 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={review.user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop"} alt={review.user?.fullName || "User"} className="h-11 w-11 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{review.user?.fullName || "Anonymous User"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                  <RatingStars rating={Number(review.rating || 0)} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyDetails
