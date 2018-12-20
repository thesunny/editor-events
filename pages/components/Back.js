import Link from "next/link"

export default function() {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item active" aria-current="page">
          <Link href="/">
            <a href="/">Home</a>
          </Link>
        </li>
      </ol>
    </nav>
  )
}
