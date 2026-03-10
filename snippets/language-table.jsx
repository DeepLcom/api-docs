export const LanguageTable = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('name')
    const [sortOrder, setSortOrder] = useState('asc')
    const [featureFilters, setFeatureFilters] = useState({
        translation: false,
        glossaries: false,
        tagHandling: false,
        textImprovement: false
    })

    const featureDescriptions = {
        translation: 'Supports text and document translation via the /translate endpoint.',
        glossaries: 'Supports custom glossaries to control how specific terms are translated.',
        tagHandling: 'Supports XML/HTML tag handling to preserve markup during translation.',
        textImprovement: 'Supports the /write endpoint for text improvement (DeepL API for Write).'
    }

    // Language data with individual feature support
    const languageData = [
        // Fully supported languages (source + target + glossaries + tag handling)
        { code: 'AR', name: 'Arabic', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'BG', name: 'Bulgarian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'CS', name: 'Czech', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'DA', name: 'Danish', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'DE', name: 'German', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: true },
        { code: 'EL', name: 'Greek', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'EN', name: 'English (all variants)', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'ES', name: 'Spanish', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: true },
        { code: 'ET', name: 'Estonian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'FI', name: 'Finnish', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'FR', name: 'French', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: true },
        { code: 'HU', name: 'Hungarian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'ID', name: 'Indonesian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'IT', name: 'Italian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: true },
        { code: 'JA', name: 'Japanese', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'KO', name: 'Korean', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'LT', name: 'Lithuanian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'LV', name: 'Latvian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'NB', name: 'Norwegian Bokmål', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'NL', name: 'Dutch', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'PL', name: 'Polish', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'PT', name: 'Portuguese (unspecified variant)', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'RO', name: 'Romanian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'RU', name: 'Russian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'SK', name: 'Slovak', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'SL', name: 'Slovenian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'SV', name: 'Swedish', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'TR', name: 'Turkish', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'UK', name: 'Ukrainian', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'ZH', name: 'Chinese (unspecified variant)', translation: true, isVariant: false, glossaries: true, tagHandling: true, textImprovement: false },

        // Target-only language variants (cannot be used as source)
        { code: 'EN-GB', name: 'English (British)', translation: true, isVariant: true, glossaries: true, tagHandling: true, textImprovement: true },
        { code: 'EN-US', name: 'English (American)', translation: true, isVariant: true, glossaries: true, tagHandling: true, textImprovement: true },
        { code: 'PT-BR', name: 'Portuguese (Brazilian)', translation: true, isVariant: true, glossaries: true, tagHandling: true, textImprovement: true },
        { code: 'PT-PT', name: 'Portuguese (European)', translation: true, isVariant: true, glossaries: true, tagHandling: true, textImprovement: true },
        { code: 'ZH-HANS', name: 'Chinese (simplified)', translation: true, isVariant: true, glossaries: true, tagHandling: true, textImprovement: false },
        { code: 'ZH-HANT', name: 'Chinese (traditional)', translation: true, isVariant: true, glossaries: true, tagHandling: true, textImprovement: false },

        // Target-only text translation only variant (no glossaries, no tag handling)
        { code: 'ES-419', name: 'Spanish (Latin American)', translation: true, isVariant: true, glossaries: false, tagHandling: false, textImprovement: false },

        // Text-only languages (both source and target, but no glossaries or tag handling)
        { code: 'ACE', name: 'Acehnese', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'AF', name: 'Afrikaans', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'AS', name: 'Assamese', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'AZ', name: 'Azerbaijani', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'BA', name: 'Bashkir', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'BE', name: 'Belarusian', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'BHO', name: 'Bhojpuri', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'BN', name: 'Bengali', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'BS', name: 'Bosnian', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'CEB', name: 'Cebuano', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'DIN', name: 'Dinka', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'EO', name: 'Esperanto', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'EU', name: 'Basque', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'FA', name: 'Persian', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'GL', name: 'Galician', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'GOM', name: 'Konkani', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'HA', name: 'Hausa', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'HE', name: 'Hebrew', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'HR', name: 'Croatian', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'IG', name: 'Igbo', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'JV', name: 'Javanese', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'KK', name: 'Kazakh', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'KY', name: 'Kyrgyz', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'LA', name: 'Latin', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'LB', name: 'Luxembourgish', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'LMO', name: 'Lombard', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'LN', name: 'Lingala', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'MAI', name: 'Maithili', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'MG', name: 'Malagasy', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'MI', name: 'Maori', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'MK', name: 'Macedonian', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'MN', name: 'Mongolian', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'MR', name: 'Marathi', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'MS', name: 'Malay', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'MT', name: 'Maltese', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'MY', name: 'Burmese', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'NE', name: 'Nepali', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'OC', name: 'Occitan', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'OM', name: 'Oromo', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'PAG', name: 'Pangasinan', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'PAM', name: 'Kapampangan', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'PS', name: 'Pashto', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'RW', name: 'Kinyarwanda', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'SA', name: 'Sanskrit', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'SCN', name: 'Sicilian', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'SG', name: 'Sango', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'SN', name: 'Shona', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'SO', name: 'Somali', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'SQ', name: 'Albanian', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'ST', name: 'Sesotho', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'SU', name: 'Sundanese', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'SW', name: 'Swahili', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'TG', name: 'Tajik', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'TH', name: 'Thai', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'TK', name: 'Turkmen', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'TL', name: 'Tagalog', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'TN', name: 'Tswana', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'TS', name: 'Tsonga', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'TT', name: 'Tatar', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'UG', name: 'Uyghur', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'UR', name: 'Urdu', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'UZ', name: 'Uzbek', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'VI', name: 'Vietnamese', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'XH', name: 'Xhosa', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'YO', name: 'Yoruba', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'YUE', name: 'Cantonese', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
        { code: 'ZU', name: 'Zulu', translation: true, isVariant: false, glossaries: false, tagHandling: false, textImprovement: false },
    ]

    // Filter and sort data
    const filteredData = useMemo(() => {
        let filtered = languageData.filter(lang => {
            const matchesSearch = lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lang.code.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesFeatureFilters = Object.keys(featureFilters).every(feature => {
                if (!featureFilters[feature]) return true
                return lang[feature] === true
            })

            return matchesSearch && matchesFeatureFilters
        })

        filtered.sort((a, b) => {
            let aValue, bValue

            if (sortBy === 'name') {
                aValue = a.name.toLowerCase()
                bValue = b.name.toLowerCase()
            } else if (sortBy === 'code') {
                aValue = a.code.toLowerCase()
                bValue = b.code.toLowerCase()
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

        return filtered
    }, [searchTerm, sortBy, sortOrder, featureFilters])

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(column)
            setSortOrder('asc')
        }
    }

    const handleFeatureFilterChange = (feature) => {
        setFeatureFilters(prev => ({
            ...prev,
            [feature]: !prev[feature]
        }))
    }

    const clearAllFilters = () => {
        setSearchTerm('')
        setFeatureFilters({
            translation: false,
            glossaries: false,
            tagHandling: false,
            textImprovement: false
        })
    }

    const SortIcon = ({ column }) => {
        if (sortBy !== column) {
            return <span className="text-zinc-400">↕</span>
        }
        return <span className="text-zinc-600 dark:text-zinc-300">{sortOrder === 'asc' ? '↑' : '↓'}</span>
    }

    const CheckIcon = ({ enabled }) => {
        if (enabled) {
            return <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
        }
        return <span className="text-zinc-300 dark:text-zinc-600 text-lg">-</span>
    }

    const Tooltip = ({ text, children }) => (
        <span className="group relative cursor-help">
            {children}
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded bg-zinc-800 dark:bg-zinc-700 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 z-50 text-left font-normal normal-case tracking-normal">
                {text}
            </span>
        </span>
    )

    const FeatureBadges = ({ lang }) => {
        const features = [
            { key: 'translation', label: 'Translation', variant: lang.isVariant },
            { key: 'glossaries', label: 'Glossaries' },
            { key: 'tagHandling', label: 'Tags' },
            { key: 'textImprovement', label: 'Write' },
        ]
        return (
            <div className="flex flex-wrap gap-1.5">
                {features.map(f => {
                    if (f.variant) {
                        return (
                            <span key={f.key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
                                Target Only
                            </span>
                        )
                    }
                    if (lang[f.key]) {
                        return (
                            <span key={f.key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                {f.label}
                            </span>
                        )
                    }
                    return null
                })}
            </div>
        )
    }

    const activeFiltersCount = Object.values(featureFilters).filter(Boolean).length
    const hasAnyFilter = activeFiltersCount > 0 || searchTerm.length > 0

    return (
        <div className="not-prose">
            <div className="mb-6 space-y-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search languages or codes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                    />
                </div>

                {/* Feature Filters */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="flex flex-row items-center justify-between mb-3">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Filter by feature
                        </span>
                        {hasAnyFilter && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { key: 'translation', label: 'Translation' },
                            { key: 'glossaries', label: 'Glossaries' },
                            { key: 'tagHandling', label: 'Tag Handling' },
                            { key: 'textImprovement', label: 'Text Improvement' }
                        ].map(({ key, label }) => (
                            <label
                                key={key}
                                className={`flex items-center space-x-2 cursor-pointer rounded-md px-3 py-2 transition-colors ${
                                    featureFilters[key]
                                        ? 'bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-300 dark:ring-blue-700'
                                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-700/50'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={featureFilters[key]}
                                    onChange={() => handleFeatureFilterChange(key)}
                                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                                />
                                <span className={`text-sm ${
                                    featureFilters[key]
                                        ? 'font-semibold text-blue-700 dark:text-blue-300'
                                        : 'text-zinc-700 dark:text-zinc-300'
                                }`}>
                                    {label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Showing {filteredData.length} of {languageData.length} languages
                    {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active)`}
                </div>
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block relative">
                <div className="overflow-x-auto -mx-4 px-4 scrollbar-thin" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <table className="w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                        <thead className="bg-zinc-50 dark:bg-zinc-800 sticky top-0 z-10">
                            <tr>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                    onClick={() => handleSort('code')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Code</span>
                                        <SortIcon column="code" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Language</span>
                                        <SortIcon column="name" />
                                    </div>
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                                    <Tooltip text={featureDescriptions.translation}>
                                        Translation
                                    </Tooltip>
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                                    <Tooltip text={featureDescriptions.glossaries}>
                                        Glossaries
                                    </Tooltip>
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                                    <Tooltip text={featureDescriptions.tagHandling}>
                                        Tag Handling
                                    </Tooltip>
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                                    <Tooltip text={featureDescriptions.textImprovement}>
                                        Text Improvement
                                    </Tooltip>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-zinc-200 dark:bg-zinc-900 dark:divide-zinc-700">
                            {filteredData.map((lang) => (
                                <tr key={lang.code} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-zinc-900 dark:text-zinc-100">
                                        <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs">
                                            {lang.code}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 min-w-[200px]">
                                        {lang.name}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        {lang.isVariant ? (
                                            <Tooltip text="This language variant can only be used as a target language, not as a source language.">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
                                                    Target Only
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            <CheckIcon enabled={lang.translation} />
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <CheckIcon enabled={lang.glossaries} />
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <CheckIcon enabled={lang.tagHandling} />
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <CheckIcon enabled={lang.textImprovement} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden space-y-2">
                {filteredData.map((lang) => (
                    <div
                        key={lang.code}
                        className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 bg-white dark:bg-zinc-900"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {lang.name}
                            </span>
                            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-mono text-zinc-700 dark:text-zinc-300">
                                {lang.code}
                            </code>
                        </div>
                        <FeatureBadges lang={lang} />
                    </div>
                ))}
            </div>

            {filteredData.length === 0 && (
                <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                    No languages found matching your criteria.
                </div>
            )}
        </div>
    )
}
