const fs = require('fs');
let content = fs.readFileSync('../frontend/src/pages/PortfolioPage.jsx', 'utf8');

// Replace top imports
content = content.replace(
  "import { getPortfolio, addStockToPortfolio } from '../../services/api';\nimport { INDIAN_STOCKS } from '../data/indianStocks';",
  "import { getPortfolio, addStockToPortfolio, searchIndianStocks } from '../../services/api';"
);

// We need to add state for live suggestions and replacing the old static ones.
// Search for `const suggestions` to `  const selectStock = `
const regexSuggestions = /const suggestions = INDIAN_STOCKS[\s\S]*?const selectStock/m;
content = content.replace(regexSuggestions, `const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const results = await searchIndianStocks(searchQuconst fs = require('fs');
let contullet content = fs.readFil }
// Replace top imports
content = content.replace(
  "import { getPortfolio, add ficontent = content.repIs  "import { getPortfolio, }  "import { getPortfolio, addStockToPortfolio, searchIndianStocks } from '../../services/api';"
);

// We need to add state for liy]);

// We need to add state for live suggestions and replacing the old static ones.
// Search al
d l// Search for `const suggestions` to `  const selectStock = `
const regexSuggeenconst regexSuggestions = /const suggestions = INDIAN_STOCKS[rucontent = content.replace(regexSuggestions, `const [suggestions, setSuggestions] = usek   const [isSearching, setIsSearching] = useState(fad/src/pages/PortfolioPage.jsx', content);
