import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatSEK } from "@/lib/utils";
import { ConditionBadge } from "@/components/ui/Badge";

interface ProductArchiveProps {
  title: string;
  description: string;
  products: Product[];
  breadcrumb?: string;
}

export function ProductArchive({ title, description, products, breadcrumb = "Butik" }: ProductArchiveProps) {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <nav aria-label="Brödsmulor" className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-stone-500">
        <Link href="/" className="hover:text-stone-900">Hem</Link>
        <span aria-hidden="true">/</span>
        <span className="text-stone-900">{breadcrumb}</span>
      </nav>

      <header className="mb-12 border-b border-stone-200 pb-8">
        <h1 className="font-serif text-4xl font-normal text-stone-900 sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">{description}</p>
      </header>

      {products.length === 0 ? (
        <div className="border border-stone-200 bg-white px-6 py-16 text-center">
          <p className="font-serif text-xl text-stone-900">Inga produkter publicerade ännu</p>
          <p className="mt-2 text-xs text-stone-500">Lägg till produkter från Produktkatalogen i admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
          {products.map((product) => (
            <Link key={product.id} href={`/butik/${product.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <Image
                  src={product.primaryImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {product.stockStatus === "sald" && <span className="absolute left-3 top-3 bg-stone-900 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-white">Såld</span>}
                {product.stockStatus !== "sald" && product.conditionGrade && <span className="absolute left-3 top-3"><ConditionBadge grade={product.conditionGrade} /></span>}
              </div>
              <div className="pt-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500">{product.designer}</p>
                <h2 className="mt-1 line-clamp-2 font-serif text-lg leading-tight text-stone-900 group-hover:text-stone-600">{product.name}</h2>
                <p className="mt-2 text-sm font-mono font-semibold text-stone-900">{formatSEK(product.basePrice)}</p>
                {product.materialIds?.length > 0 && <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-stone-500">Välj material</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
