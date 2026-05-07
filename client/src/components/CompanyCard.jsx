import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const CompanyCard = ({ company }) => {
  const navigate = useNavigate()

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`halfGradient-${company.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path fill={`url(#halfGradient-${company.id})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        )
      } else {
        stars.push(
          <svg key={i} className="h-4 w-4 text-gray-300" viewBox="0 0 20 20">
            <path fill="currentColor" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        )
      }
    }
    return stars
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md md:flex-row md:items-start md:gap-6 md:p-6">
      {/* Logo */}
      <div className={`${company.logoBg} flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg text-center text-white shadow-md md:h-20 md:w-20`}>
        <span className="text-sm font-bold md:text-lg">{company.logo}</span>
      </div>

      {/* Company Info */}
      <div className="flex-1">
        <div className="flex flex-col gap-2 md:gap-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-semibold text-foreground md:text-xl">{company.name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              {company.address}
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">{renderStars(company.rating)}</div>
              <span className="text-sm font-semibold text-foreground">{company.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">{company.reviewsCount} Reviews</span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
              Founded on {company.foundedOn}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Button */}
      <div className="flex-shrink-0 md:mt-0">
        <Button
          variant="default"
          className="w-full bg-gray-700 hover:bg-gray-800 md:w-auto"
          onClick={() => navigate(`/company/${company.id}`)}
        >
          Detail Review
        </Button>
      </div>
    </div>
  )
}

export default CompanyCard
