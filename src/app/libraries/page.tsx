import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LibrariesPage() {
  // In a real app, this data would come from Supabase
  const libraries = [
    {
      id: 1,
      name: "City Central Library",
      address: "123 Main St, Anytown",
      books: 15420,
    },
    {
      id: 2,
      name: "University Research Library",
      address: "456 College Ave, University City",
      books: 87350,
    },
    {
      id: 3,
      name: "Community Public Library",
      address: "789 Oak St, Smallville",
      books: 3250,
    },
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Libraries</h1>
          <p className="text-muted-foreground">Browse our collection of participating libraries</p>
        </div>
        <Button asChild>
          <Link href="/register">Register Library</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraries.map((library) => (
          <Card key={library.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{library.name}</CardTitle>
              <CardDescription>{library.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{library.books} books</span>
                <Button variant="outline" asChild>
                  <Link href={`/libraries/${library.id}`}>View Collection</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}