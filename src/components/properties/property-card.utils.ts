import { PublicProperty } from "@/modules/public/types/property";

export interface PropertyCardFormattedData {
  areaText: string;
  configText: string;
  basePrice: string;
  hasOnwards: boolean;
  isPriceOnRequest: boolean;
  displayPrice: string;
}

/**
 * Formats a numeric price into standard Indian currency representation (e.g. ₹58 Lakhs, ₹1.45 Cr)
 */
export function formatCurrencyPrice(price: number): string {
  if (!price || price <= 0) return "";

  // Normalize if price was entered as crores directly (e.g. 2.85 instead of 28500000)
  const actual = (price > 0 && price < 100) ? price * 10000000 : price;

  if (actual >= 10000000) {
    const cr = (actual / 10000000).toLocaleString("en-IN", { maximumFractionDigits: 2 });
    return `₹${cr} Cr`;
  }
  if (actual >= 100000) {
    const lakhs = (actual / 100000).toLocaleString("en-IN", { maximumFractionDigits: 2 });
    return `₹${lakhs} Lakhs`;
  }
  return `₹${actual.toLocaleString("en-IN")}`;
}

/**
 * Computes dynamic card fields (Area, Configuration Range, Starting Price)
 * using individual records from property_configurations as the source of truth.
 */
export function getPropertyCardData(property: PublicProperty): PropertyCardFormattedData {
  const allConfigs = property.propertyConfigurations || [];
  // Use authentic records from property_configurations if available
  const realConfigs = allConfigs.filter(c => !c.id.startsWith("synth-"));
  const configs = realConfigs.length > 0 ? realConfigs : allConfigs;

  // ==========================================
  // 1. CARPET AREA LOGIC
  // ==========================================
  // "Minimum to maximum carpet_area across configurations.
  // Exclude configurations without a valid carpet area from the area range.
  // For a property with only one configuration, retain the existing single-value display."
  let areaText = "Area on Req";
  const validAreas = configs
    .map(c => Number(c.carpetArea))
    .filter(a => !isNaN(a) && a > 0);

  if (validAreas.length > 1) {
    const minArea = Math.min(...validAreas);
    const maxArea = Math.max(...validAreas);
    if (minArea < maxArea) {
      areaText = `${minArea.toLocaleString("en-IN")}–${maxArea.toLocaleString("en-IN")} Sq.ft`;
    } else {
      areaText = `${minArea.toLocaleString("en-IN")} Sq.ft`;
    }
  } else if (validAreas.length === 1) {
    areaText = `${validAreas[0].toLocaleString("en-IN")} Sq.ft`;
  } else if (property.carpetArea && Number(property.carpetArea) > 0) {
    areaText = `${Number(property.carpetArea).toLocaleString("en-IN")} Sq.ft`;
  } else if (property.floorPlans?.[0]?.area && Number(property.floorPlans[0].area) > 0) {
    areaText = `${Number(property.floorPlans[0].area).toLocaleString("en-IN")} Sq.ft`;
  }

  // ==========================================
  // 2. CONFIGURATION / PROPERTY TYPE RANGE LOGIC
  // ==========================================
  // "Display the configuration range, e.g. 1–3 BHK, where applicable.
  // For a property with only one configuration, retain the existing single-value display."
  let configText = "";

  if (configs.length === 1) {
    // Single configuration: retain single-value display
    configText = configs[0].configurationType || (property.bedrooms ? `${property.bedrooms} BHK` : property.propertyType);
  } else if (configs.length > 1) {
    // Multiple configurations: extract bedroom counts to form range (e.g. 1–3 BHK)
    const bedroomsList: number[] = [];
    configs.forEach(c => {
      if (typeof c.bedrooms === "number" && c.bedrooms > 0) {
        bedroomsList.push(c.bedrooms);
      } else if (c.configurationType) {
        const match = c.configurationType.match(/(\d+(?:\.\d+)?)\s*BHK/i);
        if (match) {
          bedroomsList.push(parseFloat(match[1]));
        }
      }
    });

    if (bedroomsList.length > 1) {
      const minBed = Math.min(...bedroomsList);
      const maxBed = Math.max(...bedroomsList);
      if (minBed < maxBed) {
        configText = `${minBed}–${maxBed} BHK`;
      } else {
        configText = `${minBed} BHK`;
      }
    } else if (bedroomsList.length === 1) {
      configText = `${bedroomsList[0]} BHK`;
    } else {
      // Non-BHK configurations (e.g. Plots, Commercial)
      const distinctTypes = Array.from(new Set(configs.map(c => c.configurationType).filter(Boolean)));
      configText = distinctTypes.length > 0 ? distinctTypes.join(", ") : (property.propertyType || "Residential");
    }
  } else {
    // Fallback: If no propertyConfigurations present
    if (property.configurations && property.configurations.length > 1) {
      const beds: number[] = [];
      property.configurations.forEach(cfg => {
        const match = cfg.match(/(\d+(?:\.\d+)?)\s*BHK/i);
        if (match) beds.push(parseFloat(match[1]));
      });
      if (beds.length > 1) {
        const minB = Math.min(...beds);
        const maxB = Math.max(...beds);
        configText = minB < maxB ? `${minB}–${maxB} BHK` : `${minB} BHK`;
      } else {
        configText = property.configurations.join(", ");
      }
    } else if (property.configurations && property.configurations.length === 1) {
      configText = property.configurations[0];
    } else if (property.floorPlans && property.floorPlans.length > 0) {
      const fpConfigs = Array.from(new Set(property.floorPlans.map(f => f.configuration).filter(Boolean)));
      configText = fpConfigs.length > 0 ? fpConfigs.join(", ") : (property.bedrooms ? `${property.bedrooms} BHK` : property.propertyType);
    } else {
      configText = property.bedrooms ? `${property.bedrooms} BHK` : (property.propertyType || "Residential");
    }
  }

  // ==========================================
  // 3. STARTING PRICE LOGIC
  // ==========================================
  // "Lowest base_price among all available property configurations.
  // Exclude configurations without a valid price from the starting-price calculation.
  // For a property with only one configuration, retain the existing single-value display."
  let basePrice = "";
  let isPriceOnRequest = false;

  const validPrices = configs
    .map(c => Number(c.basePrice))
    .filter(p => !isNaN(p) && p > 0);

  if (validPrices.length > 0) {
    const minPrice = Math.min(...validPrices);
    basePrice = formatCurrencyPrice(minPrice);
  } else if (property.price && Number(property.price) > 0) {
    basePrice = formatCurrencyPrice(Number(property.price));
  } else if (property.priceDisplay) {
    basePrice = property.priceDisplay
      .replace(/\s*onwards\s*/gi, "")
      .replace(/\s*\*+\s*/g, "")
      .trim();
  }

  if (!basePrice || basePrice.toLowerCase().includes("request")) {
    isPriceOnRequest = true;
    basePrice = "";
  }

  const hasOnwards = !isPriceOnRequest && Boolean(basePrice);
  const displayPrice = isPriceOnRequest ? "Price on Request" : `${basePrice} onwards *`;

  return {
    areaText,
    configText,
    basePrice,
    hasOnwards,
    isPriceOnRequest,
    displayPrice,
  };
}
