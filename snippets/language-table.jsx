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

            // Apply feature filters
            const matchesFeatureFilters = Object.keys(featureFilters).every(feature => {
                if (!featureFilters[feature]) return true // If filter is off, don't filter by this feature
                return lang[feature] === true // Only show languages that have this feature
            })

            return matchesSearch && matchesFeatureFilters
        })

        // Sort data
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

    const activeFiltersCount = Object.values(featureFilters).filter(Boolean).length

    return (
        <div className="not-prose">
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search languages or codes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>
                </div>

                {/* Feature Filters */}
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2 sm:mb-0">
                            Filter by Features {activeFiltersCount > 0 && `(${activeFiltersCount} active)`}
                        </h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { key: 'translation', label: 'Translation' },
                            { key: 'glossaries', label: 'Glossaries' },
                            { key: 'tagHandling', label: 'Tag Handling' },
                            { key: 'textImprovement', label: 'Text Improvement' }
                        ].map(({ key, label }) => (
                            <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={featureFilters[key]}
                                    onChange={() => handleFeatureFilterChange(key)}
                                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                                />
                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {label}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Showing {filteredData.length} of {languageData.length} languages
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                    <thead className="bg-zinc-50 dark:bg-zinc-800">
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
                                <div className="text-center">
                                    <div>Translation</div>
                                </div>
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                                <div className="text-center">
                                    <div>Glossaries</div>
                                </div>
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                                <div className="text-center">
                                    <div>Tag</div>
                                    <div>Handling</div>
                                </div>
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                                <div className="text-center">
                                    <div>Text</div>
                                    <div>Improvement</div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-200 dark:bg-zinc-900 dark:divide-zinc-700">
                        {filteredData.map((lang) => (
                            <tr key={lang.code} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
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
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">
                                            Target Only
                                        </span>
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

            {filteredData.length === 0 && (
                <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                    No languages found matching your criteria.
                </div>
            )}
        </div>
    )
}
