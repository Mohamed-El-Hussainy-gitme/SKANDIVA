import os

with open("src/data/initialData.ts", "r", encoding="utf-8") as f:
    code = f.read()

# Replace INITIAL_ORDERS and INITIAL_QUOTES with strictly matching objects
orders_section = """export const INITIAL_ORDERS: Order[] = [
  {
    id: "order-demo-8942",
    orderNumber: "SKD-2026-8942",
    orderType: "tjanst",
    customerName: "Astrid Lindgren",
    customerEmail: "astrid.lindgren@stockholm.se",
    customerPhone: "070-555 43 21",
    customerAddress: "Dalagatan 46",
    customerPostalCode: "113 24",
    customerCity: "Stockholm",
    deliveryZoneId: "zone-stockholm-innerstad",
    deliveryZoneName: "Stockholm Innerstad & Närförort",
    deliveryFee: 0,
    subtotal: 5440,
    taxAmount: 1360,
    totalAmount: 6800,
    paymentMethod: "klarna",
    paymentStatus: "betald",
    status: "i_verkstaden",
    items: [
      {
        id: "item-8942-1",
        type: "service",
        referenceId: "serv-lamino-express",
        title: "Lamino Express — Fårskinnsomklädsel",
        selectedVariantName: "Gotlandsfårskinn Grå",
        selectedMaterial: "Gotlandsfårskinn Grå",
        selectedAddons: ["Klä även matchande Lamino Fotpall (+1 900 kr)"],
        quantity: 1,
        unitPrice: 6800,
        totalPrice: 6800,
        image: "/IMG_0948.png",
      },
    ],
    trackingEvents: [
      {
        id: "ev-8942-1",
        status: "mottagen",
        title: "Mottagen & Registrerad",
        description: "Möbeln har anlänt till Skandiva Ateljé på Södermalm. ID-tagg fäst och besiktning påbörjad.",
        timestamp: "2026-08-20T09:15:00Z",
        completed: true,
        active: false,
        technicianNote: "Stomme i gott skick, behöver lätt rengöring.",
      },
      {
        id: "ev-8942-2",
        status: "material_forbereds",
        title: "Material & Bärväv Förbereds",
        description: "Gammal klädsel demonterad. Ny förstärkt bärväv i naturhampa tillskuren och uppspänd.",
        timestamp: "2026-08-22T14:30:00Z",
        completed: true,
        active: false,
        technicianNote: "Skandilock-fårskinnsparti matchat.",
      },
      {
        id: "ev-8942-3",
        status: "i_verkstaden",
        title: "I Verkstaden (Tapetsering)",
        description: "Tapetserarmästare monterar Skandilock-fårskinnet med handsydda fästpunkter.",
        timestamp: "2026-08-25T11:00:00Z",
        completed: false,
        active: true,
        technicianNote: "Påbörjad montering av ryggparti.",
      },
      {
        id: "ev-8942-4",
        status: "kvalitetskontroll",
        title: "Kvalitetskontroll & Slutfinish",
        description: "Slutbesiktning av spänst, sömmar och träfinish inför certifiering.",
        timestamp: "",
        completed: false,
        active: false,
      },
      {
        id: "ev-8942-5",
        status: "redo_for_leverans",
        title: "Redo för Leverans / Möbelbud",
        description: "Emballerad i möbelfilt och bokad för transport med eget möbelbud.",
        timestamp: "",
        completed: false,
        active: false,
      },
    ],
    estimatedCompletionDate: "2026-09-02",
    assignedUpholsterer: "Lars Bergström (Mästare)",
    createdAt: "2026-08-20T09:00:00Z",
    updatedAt: "2026-08-25T11:00:00Z",
  },
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: "quote-101",
    quoteNumber: "OFF-2026-1045",
    isB2B: false,
    contactName: "Henrik Wallenberg",
    email: "henrik.w@investor.se",
    phone: "070-888 12 34",
    city: "Stockholm",
    furnitureType: "Fatolj",
    designerModel: "Bruno Mathsson Pernilla 69 (2 st)",
    numberOfPieces: 2,
    fabricPreference: "Elmo Soft Läder Mörkbrun",
    currentConditionDescription: "Slitna bärband och noppigt tyg. Behöver totalrenovering.",
    images: ["/IMG_1236.png"],
    status: "ny",
    quotedPrice: 12500,
    notes: "Kund önskar hämtning på Östermalm.",
    createdAt: "2026-08-26T14:20:00Z",
  },
];
"""

# Find where INITIAL_ORDERS starts
start_idx = code.find("export const INITIAL_ORDERS: Order[] =")
reviews_idx = code.find("export const INITIAL_REVIEWS: Review[] =")

if start_idx != -1 and reviews_idx != -1:
    new_code = code[:start_idx] + orders_section + "\n" + code[reviews_idx:]
    with open("src/data/initialData.ts", "w", encoding="utf-8") as f:
        f.write(new_code)
    print("Successfully updated initialData.ts orders & quotes!")
else:
    print("Could not find start/end marks", start_idx, reviews_idx)
