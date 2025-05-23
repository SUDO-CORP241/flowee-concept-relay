import * as React from "react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useUser()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link to="/" className="font-bold text-lg">
            E-Commerce App
          </Link>
          <nav className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center gap-2">
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/stores" className="flex items-center gap-2">
                Stores
              </Link>
            </Button>
            {currentUser?.role === "admin" && (
              <Button variant="ghost" asChild>
                <Link to="/admin" className="flex items-center gap-2">
                  Admin
                </Link>
              </Button>
            )}
            {currentUser?.role === "driver" && (
              <Button variant="ghost" asChild>
                <Link to="/deliveries" className="flex items-center gap-2">
                  Deliveries
                </Link>
              </Button>
            )}
            {currentUser?.role === "customer" && (
              <Button variant="ghost" asChild>
                <Link to="/orders" className="flex items-center gap-2">
                  Orders
                </Link>
              </Button>
            )}
            {currentUser?.role === 'store' && (
              <Button variant="ghost" asChild>
                <Link to="/packs" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Packs
                </Link>
              </Button>
            )}
            {currentUser ? (
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-background border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} E-Commerce App. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout
