import os

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Wrote:", filepath)

# 1. Product Detail Page
write("src/app/butik/[slug]/page.tsx", """\"use client\";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INITIAL_PRODUCTS } from "@/data/initialData";
import { ProductVariant } from "@/types";
import { useCart, formatSEK } from "@/lib/store";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { ConditionBadge, StockBadge } from "@/components/ui/Badge";
import { Check, ShoppingBag, Shield, Truck, ArrowLeft, Ruler, History } from "lucide-react";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug || p.id === params.slug);

  if (!product) {
    notFound();
  }

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: "default",
      name: "Standardutförande",
      fabricName: "Original",
      fabricColorHex: "#5B4433",
      materialDescription: "Högsta kvalitet",
      priceDelta: 0,
      sku: "SKD-01",
      inStock: true,
    }
  );

  const [selectedImage, setSelectedImage] = useState<string>(product.primaryImage);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const { addItem, setIsDrawerOpen } = useCart();

  const currentPrice = useMemo(() => {
    return (product.basePrice + selectedVariant.priceDelta) * quantity;
  }, [product.basePrice, selectedVariant.priceDelta, quantity]);

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant.id}-${Date.now()}`,
      type: "product",
      referenceId: product.id,
      title: product.name,
      designerOrModel: `${product.designer} — ${product.model}`,
      selectedVariantName: selectedVariant.name,
      selectedVariantPrice: product.basePrice + selectedVariant.priceDelta,
      quantity,
      unitPrice: product.basePrice + selectedVariant.priceDelta,
      totalPrice: currentPrice,
      image: selectedVariant.image || product.primaryImage,
    });

    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setIsDrawerOpen(true);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="flex items-center gap-2 text-xs font-mono">
        <Link href="/butik" className="text-ink/60 hover:text-wood flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tillbaka till Butiken</span>
        </Link>
        <span className="text-stone">/</span>
        <span className="text-wood font-medium">{product.designer}</span>
        <span className="text-stone">/</span>
        <span className="text-ink truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full bg-stone-light border border-stone shadow-sm overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.conditionGrade && <ConditionBadge grade={product.conditionGrade} />}
              <StockBadge status={product.stockStatus} />
            </div>
          </div>

          {product.galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square border overflow-hidden transition-all ${
                    selectedImage === img ? "border-wood ring-2 ring-wood/20" : "border-stone hover:border-stone-dark"
                  }`}
                >
                  <Image src={img} alt={`Bild ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {product.beforeImage && product.afterImage && (
            <div className="pt-6 border-t border-stone">
              <BeforeAfterSlider
                beforeImage={product.beforeImage}
                afterImage={product.afterImage}
                title="Restaureringsprocess i Verkstaden"
                description="Se möbelns skick innan renovering och slutresultatet efter vår tapetsering."
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-stone pb-6 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-wood">
              <span className="uppercase tracking-widest font-semibold">{product.designer}</span>
              <span>Modell: {product.model}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                {formatSEK(product.basePrice + selectedVariant.priceDelta)}
              </span>
              <span className="text-xs font-mono text-ink/60">inkl. 25% moms</span>
            </div>
          </div>

          {product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-wood font-semibold">
                Välj Utförande / Tyg & Skinn
              </label>
              <div className="space-y-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full p-3 text-left border flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-wood bg-stone-light/60 ring-1 ring-wood"
                          : "border-stone bg-canvas hover:border-stone-dark hover:bg-stone-light/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-inner"
                          style={{ backgroundColor: v.fabricColorHex }}
                        />
                        <div>
                          <div className="text-xs font-medium text-ink flex items-center gap-2">
                            <span>{v.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-wood" />}
                          </div>
                          <p className="text-[11px] text-ink/65 font-sans mt-0.5">{v.materialDescription}</p>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs text-ink font-semibold">
                        {v.priceDelta === 0 ? "Standard" : `+${formatSEK(v.priceDelta)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone bg-canvas">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-ink hover:bg-stone-light font-mono text-sm"
                >
                  -
                </button>
                <span className="px-4 py-2.5 font-mono text-sm text-ink font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-ink hover:bg-stone-light font-mono text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedNotice}
                className="flex-1 py-3.5 px-6 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedNotice ? "Tillagd i varukorgen!" : `Lägg i varukorg • ${formatSEK(currentPrice)}`}</span>
              </button>
            </div>

            <div className="p-4 bg-stone-light/40 border border-stone space-y-2 text-xs font-mono text-ink/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-wood" />
                <span>Hämtning i verkstad (Stockholm) eller hemleverans</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-wood" />
                <span>5 års hantverksgaranti & äkthetscertifikat ingår</span>
              </div>
            </div>
          </div>

          <div className="p-5 border border-dashed border-wood/40 bg-[#F4EFE6]/60 flex items-center gap-4">
            <CrestSeal size="sm" variant="wood" subtitle="" className="shrink-0" />
            <div>
              <span className="font-serif text-sm font-semibold text-ink block">
                Skandiva Provenienssigill
              </span>
              <p className="text-xs text-ink/75 font-sans mt-0.5">
                {product.provenanceCrestText || "Certifierat hantverk från Skandivas tapetserarmästare i Stockholm."}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone text-xs">
            {product.dimensions && (
              <div className="space-y-1">
                <span className="font-mono font-semibold uppercase text-wood flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" /> Mått & Dimensioner
                </span>
                <p className="text-ink/80 font-sans">{product.dimensions}</p>
              </div>
            )}

            {product.historicalContext && (
              <div className="space-y-1 pt-2">
                <span className="font-mono font-semibold uppercase text-wood flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Formgivarhistoria
                </span>
                <p className="text-ink/80 font-sans leading-relaxed">{product.historicalContext}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
""")

# 2. Lamino Express Configurator
write("src/app/tjanster/lamino-express/page.tsx", """\"use client\";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { INITIAL_SERVICES } from "@/data/initialData";
import { ServiceOptionMaterial, ServiceAddon } from "@/types";
import { useCart, formatSEK } from "@/lib/store";
import { CrestSeal } from "@/components/ui/CrestSeal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { 
  Check, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Hammer, 
  ShoppingBag, 
  Info
} from "lucide-react";

export default function LaminoExpressPage() {
  const service = INITIAL_SERVICES.find((s) => s.slug === "lamino-express") || INITIAL_SERVICES[0];

  const [selectedMaterial, setSelectedMaterial] = useState<ServiceOptionMaterial>(
    service.materials[0] || {
      id: "default",
      name: "Skandinaviskt Fårskinn Grafitgrå",
      category: "farskinn",
      colorName: "Grafitgrå",
      colorHex: "#6B6A68",
      price: 0,
    }
  );

  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [addedNotice, setAddedNotice] = useState(false);

  const { addItem, setIsDrawerOpen } = useCart();

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculatedTotal = useMemo(() => {
    let total = service.basePrice;
    total += selectedMaterial.price;

    selectedAddonIds.forEach((addonId) => {
      const addon = service.addons.find((a) => a.id === addonId);
      if (addon) total += addon.price;
    });

    return total;
  }, [service.basePrice, selectedMaterial.price, selectedAddonIds, service.addons]);

  const handleAddToCart = () => {
    const selectedAddonNames = selectedAddonIds
      .map((id) => service.addons.find((a) => a.id === id)?.name)
      .filter(Boolean) as string[];

    addItem({
      id: `service-lamino-${selectedMaterial.id}-${Date.now()}`,
      type: "service",
      referenceId: service.id,
      title: "Lamino Express™ Omklädsel",
      designerOrModel: "Yngve Ekström Lamino Fåtölj",
      selectedMaterial: selectedMaterial.name,
      selectedAddons: selectedAddonNames,
      quantity: 1,
      unitPrice: calculatedTotal,
      totalPrice: calculatedTotal,
      image: service.primaryImage,
    });

    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setIsDrawerOpen(true);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Link href="/tjanster" className="text-ink/60 hover:text-wood">
            Verkstadstjänster
          </Link>
          <span className="text-stone">/</span>
          <span className="text-wood font-medium">Lamino Express™</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-stone pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-wood text-canvas text-xs font-mono uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fast Pris • Garanterad Leveranstid</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
              Lamino Express™ Fårskinnsomklädsel
            </h1>
            <p className="text-sm sm:text-base text-ink/75 max-w-2xl mt-2 font-sans">
              Helrenovering av din Lamino fåtölj i förstklassigt skandinaviskt fårskinn. Komplett med ny förstärkt bärväv, trävaxning och 5 års hantverksgaranti.
            </p>
          </div>

          <div className="bg-stone-light/60 border border-stone p-4 shrink-0 flex items-center gap-4">
            <CrestSeal size="sm" variant="wood" subtitle="" />
            <div>
              <span className="font-mono text-xs text-wood uppercase block">Fast Pris Från</span>
              <span className="font-mono text-2xl font-bold text-ink">4 900 kr</span>
              <span className="text-[11px] font-mono text-ink/60 block">Ledtid: 10–14 arbetsdagar</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone/60 pb-2">
              <h3 className="font-serif text-xl font-semibold text-ink flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-ink text-canvas font-mono text-xs flex items-center justify-center">1</span>
                <span>Välj Nyans på Fårskinnet</span>
              </h3>
              <span className="text-xs font-mono text-wood">100% Skandinaviskt Fårskinn</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.materials.map((mat) => {
                const isSelected = selectedMaterial.id === mat.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`p-4 text-left border transition-all ${
                      isSelected
                        ? "border-wood bg-stone-light/70 ring-1 ring-wood"
                        : "border-stone bg-canvas hover:border-stone-dark hover:bg-stone-light/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="w-6 h-6 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: mat.colorHex }}
                      />
                      <span className="font-mono text-xs font-semibold text-ink">
                        {mat.price === 0 ? "Ingår" : `+${formatSEK(mat.price)}`}
                      </span>
                    </div>

                    <div className="font-serif text-sm font-medium text-ink flex items-center gap-1.5">
                      <span>{mat.colorName}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-wood" />}
                    </div>
                    {mat.description && (
                      <p className="text-[11px] text-ink/70 font-sans mt-1 leading-snug">
                        {mat.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone/60 pb-2">
              <h3 className="font-serif text-xl font-semibold text-ink flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-ink text-canvas font-mono text-xs flex items-center justify-center">2</span>
                <span>Välj Tillval & Matchande Delar</span>
              </h3>
              <span className="text-xs font-mono text-ink/60">Valfritt</span>
            </div>

            <div className="space-y-3">
              {service.addons.map((addon) => {
                const isChecked = selectedAddonIds.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-4 border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? "border-wood bg-stone-light/70 ring-1 ring-wood"
                        : "border-stone bg-canvas hover:border-stone-dark hover:bg-stone-light/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? "bg-wood border-wood text-canvas" : "border-stone bg-canvas"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="font-serif text-sm font-medium text-ink block">
                          {addon.name}
                        </span>
                        <p className="text-xs text-ink/70 font-sans mt-0.5 max-w-md">
                          {addon.description}
                        </p>
                      </div>
                    </div>

                    <div className="font-mono text-xs font-bold text-ink whitespace-nowrap pl-4">
                      +{formatSEK(addon.price)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-canvas border border-stone space-y-4">
            <h4 className="font-serif text-lg font-medium text-ink flex items-center gap-2">
              <Info className="w-4 h-4 text-wood" />
              <span>Hur fungerar inlämning och leverans?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-ink/80">
              <div className="space-y-1">
                <strong className="font-mono text-wood block uppercase text-[11px]">1. Beställning</strong>
                <p>Du konfigurerar din order online. Du får direkt en orderbekräftelse med spårningsnummer.</p>
              </div>
              <div className="space-y-1">
                <strong className="font-mono text-wood block uppercase text-[11px]">2. Inlämning / Bud</strong>
                <p>Lämna in i vår verkstad på Södermalm eller boka vårt möbelbud direkt vid kassan.</p>
              </div>
              <div className="space-y-1">
                <strong className="font-mono text-wood block uppercase text-[11px]">3. Färdig Fåtölj</strong>
                <p>Inom 10–14 dagar är fåtöljen färdigställd, kvalitetskontrollerad och försedd med mässingssigill.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-canvas border-2 border-stone p-6 sm:p-8 space-y-6 shadow-md">
            <div className="border-b border-stone pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-wood">Orderkalkyl</span>
              <h3 className="font-serif text-2xl font-semibold text-ink mt-1">Lamino Express™ Specifikation</h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between text-ink">
                <span>Lamino Fåtölj Grundrenovering:</span>
                <span>{formatSEK(service.basePrice)}</span>
              </div>

              <div className="flex justify-between text-ink/80 pl-2 border-l border-stone">
                <span>Fårskinn: {selectedMaterial.colorName}</span>
                <span>{selectedMaterial.price === 0 ? "Ingår" : `+${formatSEK(selectedMaterial.price)}`}</span>
              </div>

              {selectedAddonIds.map((id) => {
                const addon = service.addons.find((a) => a.id === id);
                if (!addon) return null;
                return (
                  <div key={id} className="flex justify-between text-wood pl-2 border-l border-wood">
                    <span className="truncate pr-2">{addon.name}</span>
                    <span>+{formatSEK(addon.price)}</span>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-stone space-y-1">
                <div className="flex justify-between text-xs text-ink/60">
                  <span>Moms (25% ingår)</span>
                  <span>{formatSEK(calculatedTotal * 0.2)}</span>
                </div>
                <div className="flex justify-between text-xl font-serif font-bold text-ink">
                  <span>Totalt fast pris</span>
                  <span className="font-mono">{formatSEK(calculatedTotal)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addedNotice}
              className="w-full py-4 px-6 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedNotice ? "Tillagd i varukorg!" : `Boka & Lägg i Varukorg (${formatSEK(calculatedTotal)})`}</span>
            </button>

            <div className="space-y-2 pt-2 border-t border-stone text-xs font-mono text-ink/70">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-wood" />
                <span>Garanterad ledtid: 10–14 arbetsdagar</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-wood" />
                <span>5 års garanti på utfört hantverk</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-wood" />
                <span>Upphämtningsalternativ väljs i kassan</span>
              </div>
            </div>
          </div>

          {service.beforeAfterPair && (
            <BeforeAfterSlider
              beforeImage={service.beforeAfterPair.before}
              afterImage={service.beforeAfterPair.after}
              title="Före & Efter i Ateljén"
              description="Dra reglaget för att se förvandlingen."
            />
          )}
        </div>
      </div>
    </div>
  );
}
""")
