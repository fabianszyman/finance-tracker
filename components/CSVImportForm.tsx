'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { z } from 'zod';
import { expenseFormSchema, ColumnMapping } from '@/lib/validations/expense';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate, formatCurrency } from '@/lib/utils';
import { parse, isValid } from 'date-fns';
import { FileUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Add a constant at the top of your file (below imports)
const NOT_MAPPED = "NOT_MAPPED";

// CSV Import steps
type ImportStep = 'upload' | 'mapping' | 'map' | 'preview' | 'import';

export default function CSVImportForm() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [columnMapping, setColumnMapping] = useState<{
    amount: string;
    description: string;
    category: string;
    date: string;
  }>({
    amount: NOT_MAPPED,
    description: NOT_MAPPED,
    category: NOT_MAPPED,
    date: NOT_MAPPED,
  });
  const [mappedExpenses, setMappedExpenses] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});
  const [dateFormat, setDateFormat] = useState<string>("auto");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsLoading(true); // Add loading state while processing
    
    // Debug logging
    console.log("File selected:", file.name, file.type, file.size);
    
    // Use FileReader for more reliable file handling
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      console.log("CSV content loaded, first 100 chars:", csvContent.substring(0, 100));
      
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          console.log("Parse complete! Found data rows:", results.data.length);
          console.log("Headers:", results.meta.fields);
          
          if (results.data && results.data.length > 0) {
            // Store raw data without transformations
            setCsvData(results.data as Record<string, string>[]);
            
            // Extract headers for mapping
            const headers = results.meta.fields || [];
            setCsvHeaders(headers);
            
            // Auto-detect column mappings based on common names
            const detectedMapping = {
              amount: headers.find(h => /betrag|amount|sum|wert|euro/i.test(h)) || NOT_MAPPED,
              description: headers.find(h => /beschreibung|description|text|verwendungszweck/i.test(h)) || NOT_MAPPED,
              category: headers.find(h => /kategorie|category/i.test(h)) || NOT_MAPPED,
              date: headers.find(h => /datum|date|buchungsdatum|valuta/i.test(h)) || NOT_MAPPED
            };
            
            console.log("Detected column mapping:", detectedMapping);
            setColumnMapping(detectedMapping);
            
            // Force step change with timeout to ensure state updates properly
            setTimeout(() => {
              setCurrentStep('mapping');
              setIsLoading(false);
            }, 100);
          } else {
            toast.error('No data found in CSV file');
            setIsLoading(false);
          }
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          toast.error(`Error parsing CSV: ${error.message}`);
          setIsLoading(false);
        }
      });
    };
    
    reader.onerror = () => {
      console.error("FileReader error");
      toast.error("Failed to read the CSV file");
      setIsLoading(false);
    };
    
    // Start reading the file
    reader.readAsText(file);
  };

  // Handle column mapping change
  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    const newMapping = { ...columnMapping, [field]: value };
    setColumnMapping(newMapping);
    
    // Debug: Log a sample of values from the selected column
    if (csvData.length > 0) {
      console.log(`Selected ${field} column: ${value}`);
      console.log("Sample values from this column:");
      csvData.slice(0, 5).forEach((row, idx) => {
        console.log(`Row ${idx+1}: "${row[value]}"`);
      });
    }
  };

  // Generate preview data based on mapping
  const generatePreview = useCallback(() => {
    if (!csvData.length || !Object.values(columnMapping).some(v => v)) {
      toast.error('Please map at least one column');
      return;
    }
    
    // Map CSV data to expense structure
    const mapped = csvData.map((row, index) => {
      const mappedRow: any = {};
      
      if (columnMapping.amount && row[columnMapping.amount]) {
        mappedRow.amount = parseFloat(row[columnMapping.amount].replace(/[^0-9.-]+/g, ''));
      }
      
      if (columnMapping.description && row[columnMapping.description]) {
        mappedRow.description = row[columnMapping.description];
      }
      
      if (columnMapping.category && row[columnMapping.category]) {
        const category = row[columnMapping.category];
        // Try to match category with existing categories
        // For simplicity, using "Other: Miscellaneous" as default
        mappedRow.category = 'Other';
        mappedRow.category_details = [`Other: Miscellaneous`];
      }
      
      if (columnMapping.date && row[columnMapping.date]) {
        try {
          mappedRow.date = new Date(row[columnMapping.date]);
        } catch (e) {
          mappedRow.date = new Date();
        }
      } else {
        mappedRow.date = new Date();
      }
      
      return mappedRow;
    });
    
    setMappedExpenses(mapped);
    validateMappedData(mapped);
    setCurrentStep('preview');
  }, [csvData, columnMapping]);

  // Validate mapped data
  const validateMappedData = (data: any[]) => {
    const errors: Record<number, string[]> = {};
    
    data.forEach((row, index) => {
      const rowErrors: string[] = [];
      
      if (isNaN(row.amount) || row.amount <= 0) {
        rowErrors.push('Invalid amount');
      }
      
      if (!row.date || !(row.date instanceof Date) || isNaN(row.date.getTime())) {
        rowErrors.push('Invalid date');
      }
      
      if (rowErrors.length) {
        errors[index] = rowErrors;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Import expenses to database
  const importExpenses = async () => {
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix validation errors before importing');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to import expenses');
      }
      
      // Prepare records for insertion, filtering out rows with invalid data
      const validRecords = mappedExpenses
        .filter((expense, index) => !validationErrors[index]) // Skip rows with errors
        .map(expense => ({
          amount: expense.amount,
          description: expense.description || null,
          category: expense.category || 'Other',
          category_details: expense.category_details || null,
          date: expense.date instanceof Date && isValid(expense.date) 
            ? expense.date.toISOString() 
            : new Date().toISOString(), // Fallback to current date if invalid
          user_id: user.id,
        }));
      
      if (validRecords.length === 0) {
        toast.error('No valid records to import');
        setIsLoading(false);
        return;
      }
      
      // Insert in batches of 50 to avoid hitting limits
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < validRecords.length; i += 50) {
        const batch = validRecords.slice(i, i + 50);
        const { error, count } = await supabase.from('expenses').insert(batch);
        
        if (error) {
          console.error('Error importing batch:', error);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }
      
      if (errorCount > 0) {
        toast.warning(`Imported ${successCount} expenses with ${errorCount} errors`);
      } else {
        toast.success(`Successfully imported ${successCount} expenses`);
      }
      
      router.push('/expenses');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to import expenses');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the parseDate function to better handle European date formats with 2-digit years
  const parseDate = (dateString: string): Date | null => {
    if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') return null;
    
    // First try to extract dates from strings that might contain them
    const datePatterns = [
      // DD.MM.YY format (European with 2-digit year)
      /(\d{1,2})\.(\d{1,2})\.(\d{2})(?!\d)/,
      // DD.MM.YYYY format (European with 4-digit year)
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
      // Extract dates like 01.03.25-31.03.25 (take the first date)
      /(\d{1,2})\.(\d{1,2})\.(\d{2})[-\/]/,
      // Date embedded in text with format like "17.02.2025"
      /\b(\d{1,2})\.(\d{1,2})\.(\d{2,4})\b/,
      // Standard date formats
      /(\d{4})-(\d{1,2})-(\d{1,2})/,
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{1,2})-(\d{1,2})-(\d{4})/
    ];
    
    // Check for embedded dates in the string
    for (const pattern of datePatterns) {
      const match = dateString.match(pattern);
      if (match) {
        // For DD.MM.YY or DD.MM.YYYY format
        if (match[0].includes('.')) {
          const day = parseInt(match[1], 10);
          const month = parseInt(match[2], 10) - 1; // JS months are 0-based
          
          // Handle two-digit years specially
          let year: number;
          if (match[3] && match[3].length === 2) {
            // For 2-digit years, assume:
            // 00-49 → 2000-2049
            // 50-99 → 1950-1999
            const twoDigitYear = parseInt(match[3], 10);
            year = twoDigitYear < 50 ? 2000 + twoDigitYear : 1900 + twoDigitYear;
          } else {
            year = parseInt(match[3], 10);
          }
          
          // Validate the date components
          if (day > 0 && day <= 31 && month >= 0 && month <= 11 && year >= 1900) {
            const date = new Date(year, month, day);
            // Final validation - ensures Feb 30 doesn't pass as valid, etc.
            if (isValid(date) && date.getDate() === day) return date;
          }
        }
        // For YYYY-MM-DD format
        else if (match[0].includes('-') && match[0].indexOf('-') === 4) {
          const date = parse(match[0], 'yyyy-MM-dd', new Date());
          if (isValid(date)) return date;
        }
        // For MM/DD/YYYY format
        else if (match[0].includes('/')) {
          const date = parse(match[0], 'MM/dd/yyyy', new Date());
          if (isValid(date)) return date;
        }
      }
    }
    
    // Try parsing directly with explicit format strings
    const formats = [
      // German/European formats
      'dd.MM.yy',  // Add explicit support for DD.MM.YY
      'dd.MM.yyyy',
      // ISO formats
      'yyyy-MM-dd',
      // US formats
      'MM/dd/yyyy',
      // Other common formats
      'dd/MM/yyyy',
    ];
    
    // If user selected a specific format, try that first
    if (dateFormat !== "auto") {
      const parsedDate = parse(dateString, dateFormat, new Date());
      if (isValid(parsedDate)) return parsedDate;
    }
    
    // Try each format
    for (const format of formats) {
      try {
        const parsedDate = parse(dateString, format, new Date());
        if (isValid(parsedDate)) return parsedDate;
      } catch (e) {
        // Continue trying other formats
      }
    }
    
    // Extract any date-like patterns as last resort
    // This is especially helpful for dates embedded in descriptions
    const anyDateMatch = dateString.match(/\b(\d{1,2})[.-\/](\d{1,2})[.-\/](\d{2,4})\b/);
    if (anyDateMatch) {
      try {
        // Attempt to parse based on detected separators
        const separator = anyDateMatch[0].includes('.') ? '.' : 
                          anyDateMatch[0].includes('/') ? '/' : '-';
        
        const parts = anyDateMatch[0].split(separator);
        if (parts.length === 3) {
          // Assume European DD.MM.YY format when using dot separator
          if (separator === '.') {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            let year = parseInt(parts[2], 10);
            if (parts[2].length === 2) {
              year = year < 50 ? 2000 + year : 1900 + year;
            }
            const date = new Date(year, month, day);
            if (isValid(date)) return date;
          }
        }
      } catch (e) {
        // Failed to parse
      }
    }
    
    // Try built-in date parsing as last resort
    try {
      const dateObj = new Date(dateString);
      if (isValid(dateObj)) return dateObj;
    } catch (e) {
      // If all else fails, return null
    }
    
    // Add this pattern specifically for German banking date formats
    const germanBankingDatePattern = /(\d{2})\.(\d{2})\.(\d{2,4})/;

    // Consider adding this inside your parseDate function
    if (dateString.match(germanBankingDatePattern)) {
      const dateParts = dateString.split('.');
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        let year = parseInt(dateParts[2], 10);
        
        // Handle 2-digit years
        if (dateParts[2].length === 2) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }
        
        const date = new Date(year, month, day);
        if (isValid(date)) {
          console.log(`Successfully parsed German date: ${dateString} → ${date.toISOString()}`);
          return date;
        }
      }
    }
    
    // Add this to the parseDate function to directly handle the DD.MM.YY format
    const germanDateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{2})$/;
    const match = dateString.match(germanDateRegex);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // JS months are 0-based
      let year = parseInt(match[3], 10);
      
      // Handle two-digit year
      year = year < 50 ? 2000 + year : 1900 + year;
      
      const date = new Date(year, month, day);
      // Final validation
      if (isValid(date) && date.getDate() === day) {
        console.log(`Direct German date pattern matched: ${dateString} → ${date.toISOString()}`);
        return date;
      }
    }
    
    return null;
  };

  // Update parseAmount to handle European number formats and negative values
  const parseAmount = (amountString: string): number | null => {
    if (!amountString || typeof amountString !== 'string' || amountString.trim() === '') return null;
    
    // Remove any currency symbols, spaces and other non-numeric characters
    // Keep only digits, decimal separators, minus signs, and plus signs
    let cleaned = amountString.replace(/[^0-9.,\-+]/g, '');
    
    // Check if the value is already negative or has a minus prefix
    const isNegative = cleaned.startsWith('-') || amountString.startsWith('-');
    
    // Handle different decimal separators (comma vs period)
    // European format (comma as decimal separator)
    if (cleaned.includes(',') && !cleaned.includes('.')) {
      cleaned = cleaned.replace(',', '.');
    } 
    // If both comma and period exist, assume comma is thousands separator
    else if (cleaned.includes(',') && cleaned.includes('.')) {
      cleaned = cleaned.replace(/,/g, '');
    }
    // Format like 1,234.56 - remove commas
    else if (cleaned.match(/,\d{3}/)) {
      cleaned = cleaned.replace(/,/g, '');
    }
    
    // Parse the cleaned string to a number
    let parsedNumber = parseFloat(cleaned);
    
    // If the original string had a $ or € and starts with a minus sign,
    // or if the original string contains words like "debit" or "payment"
    // make sure the amount is negative for outgoing expenses
    if (isNegative && !isNaN(parsedNumber) && parsedNumber > 0) {
      parsedNumber = -parsedNumber;
    }
    
    return isNaN(parsedNumber) ? null : parsedNumber;
  };

  // Update the mapCsvDataToExpenses function
  const mapCsvDataToExpenses = () => {
    if (!csvData || !csvData.length) {
      console.log("No CSV data available");
      return [];
    }

    console.log("Mapping CSV data to expenses with column mapping:", columnMapping);
    console.log("First CSV row for debugging:", csvData[0]);
    
    const validationErrors: Record<number, string[]> = {};
    
    const mapped = csvData.map((row, index) => {
      const errors: string[] = [];
      
      // Get the raw values directly from the CSV data
      const rawDateValue = columnMapping.date !== NOT_MAPPED ? row[columnMapping.date] : null;
      const rawAmountValue = columnMapping.amount !== NOT_MAPPED ? row[columnMapping.amount] : null;
      const descriptionValue = columnMapping.description !== NOT_MAPPED ? String(row[columnMapping.description] || '') : '';
      const categoryValue = columnMapping.category !== NOT_MAPPED ? String(row[columnMapping.category] || '') : '';
      
      // Debug log the first few rows
      if (index < 3) {
        console.log(`Row ${index + 1}:`, {
          rawDateValue,
          rawAmountValue,
          descriptionValue,
          categoryValue
        });
      }
      
      // Parse amount, handle various formats including European number formats
      let amount: number | null = null;
      if (rawAmountValue) {
        // Clean up the amount string: remove currency symbols, spaces, and handle European formatting
        let cleanedAmount = String(rawAmountValue)
          .replace(/[^0-9.,\-]/g, '') // Remove anything that's not a digit, dot, comma, or minus
          .replace(/,/g, '.'); // Replace commas with dots to standardize decimal point
        
        // Handle negative amounts indicated by (amount) or -amount
        if (String(rawAmountValue).includes('(') && String(rawAmountValue).includes(')')) {
          cleanedAmount = '-' + cleanedAmount;
        }
        
        const parsedAmount = parseFloat(cleanedAmount);
        if (!isNaN(parsedAmount)) {
          amount = parsedAmount;
          console.log(`Parsed amount: ${rawAmountValue} → ${amount}`);
        } else {
          errors.push('Invalid amount');
          console.log(`Failed to parse amount: ${rawAmountValue}`);
        }
      } else {
        errors.push('Missing amount');
      }
      
      // Parse date
      let date = null;
      
      // First try the direct date value
      if (rawDateValue) {
        const dateString = String(rawDateValue).trim();
        console.log(`Parsing date from: "${dateString}"`);
        date = parseDate(dateString);
        
        if (date) {
          console.log(`Successfully parsed date: ${date.toISOString()}`);
        } else {
          console.log(`Failed to parse date from: "${dateString}"`);
        }
      }
      
      // Try to extract from description if date is still null
      if (!date && descriptionValue) {
        date = parseDate(descriptionValue);
        if (date) {
          console.log(`Extracted date from description: ${date.toISOString()}`);
        }
      }
      
      // If still no date, check for dates in other columns
      if (!date) {
        // Try each column as a possible date source
        for (const header of csvHeaders) {
          if (header !== columnMapping.date && row[header]) {
            const potentialDate = parseDate(String(row[header]));
            if (potentialDate) {
              date = potentialDate;
              console.log(`Found date in column "${header}": ${date.toISOString()}`);
              break;
            }
          }
        }
      }
      
      if (!date) {
        errors.push('Invalid date');
      }
      
      // Store errors for this row
      if (errors.length > 0) {
        validationErrors[index] = errors;
      }
      
      return {
        amount,
        description: descriptionValue || '',
        category: categoryValue || 'Other',
        date,
        _raw: {
          amount: rawAmountValue,
          date: rawDateValue,
          description: descriptionValue,
          category: categoryValue
        }
      };
    });
    
    console.log(`Mapped ${mapped.length} rows with ${Object.keys(validationErrors).length} validation errors`);
    setValidationErrors(validationErrors);
    return mapped;
  };

  // Update the renderUploadStep function to show loading state
  const renderUploadStep = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-background-hover">
        <input
          type="file"
          id="csvFile"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
        <label htmlFor="csvFile" className="w-full text-center cursor-pointer">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p>Processing {uploadedFileName}...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <FileUp className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">
                {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to upload a CSV file'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or drag and drop your file here
              </p>
            </>
          )}
        </label>
      </div>
      
      {uploadedFileName && !isLoading && (
        <Button 
          type="button"
          onClick={() => document.getElementById('csvFile')?.click()}
        >
          Choose a Different File
        </Button>
      )}
    </div>
  );

  // Add the missing renderMappingStep function
  const renderMappingStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-sm">
          Map the columns from your CSV file to the correct fields. Select which column contains each piece of information.
        </div>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount-column">Amount Column</Label>
            <Select 
              value={columnMapping.amount}
              onValueChange={(value) => handleMappingChange('amount', value)}
            >
              <SelectTrigger id="amount-column">
                <SelectValue placeholder="Select column containing amounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_MAPPED}>Not mapped</SelectItem>
                {csvHeaders.map(header => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description-column">Description Column</Label>
            <Select 
              value={columnMapping.description}
              onValueChange={(value) => handleMappingChange('description', value)}
            >
              <SelectTrigger id="description-column">
                <SelectValue placeholder="Select column containing descriptions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_MAPPED}>Not mapped</SelectItem>
                {csvHeaders.map(header => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category-column">Category Column</Label>
            <Select 
              value={columnMapping.category}
              onValueChange={(value) => handleMappingChange('category', value)}
            >
              <SelectTrigger id="category-column">
                <SelectValue placeholder="Select column containing categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_MAPPED}>Not mapped</SelectItem>
                {csvHeaders.map(header => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-column">Date Column</Label>
            <Select 
              value={columnMapping.date}
              onValueChange={(value) => handleMappingChange('date', value)}
            >
              <SelectTrigger id="date-column">
                <SelectValue placeholder="Select column containing dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NOT_MAPPED}>Not mapped</SelectItem>
                {csvHeaders.map(header => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select 
              value={dateFormat}
              onValueChange={setDateFormat}
            >
              <SelectTrigger id="date-format">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="dd.MM.yy">DD.MM.YY (German)</SelectItem>
                <SelectItem value="dd.MM.yyyy">DD.MM.YYYY (German)</SelectItem>
                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY (US)</SelectItem>
                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD (ISO)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep('upload')}
          >
            Back
          </Button>
          
          <Button
            type="button"
            onClick={() => {
              setMappedExpenses(mapCsvDataToExpenses());
              setCurrentStep('preview');
            }}
          >
            Preview Import
          </Button>
        </div>
      </div>
    );
  };

  // Update renderPreviewStep to use mappedExpenses instead of mappedData
  const renderPreviewStep = () => {
    return (
      <div className="space-y-4">
        <div className="text-sm mb-4">
          Review your data before importing. We found {mappedExpenses.length} records.
        </div>
        
        {/* Display validation errors if any */}
        {Object.keys(validationErrors).length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              {Object.keys(validationErrors).length} records have validation issues. They are highlighted in red.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappedExpenses.slice(0, 100).map((expense, index) => {
                const hasError = validationErrors[index] ? true : false;
                return (
                  <TableRow key={index}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell 
                      className={`flex items-center gap-1 ${
                        expense.amount > 0 
                          ? "text-green-600 font-medium" 
                          : ""
                      }`}
                    >
                      {expense.amount > 0 
                        ? <ArrowUpRight className="h-3 w-3" /> 
                        : <ArrowDownRight className="h-3 w-3" />
                      }
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{hasError ? 'Error' : 'Valid'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep('mapping')}
          >
            Back
          </Button>
          
          <Button
            type="button"
            onClick={importExpenses}
          >
            Import Expenses
          </Button>
        </div>
      </div>
    );
  };

  // Render step content based on current step
  const renderStepContent = () => {
    console.log("Current step:", currentStep);
    
    switch (currentStep) {
      case 'upload':
        return renderUploadStep();
      case 'mapping':
        return renderMappingStep();
      case 'preview':
        return renderPreviewStep();
      default:
        console.error("Unknown step:", currentStep);
        return renderUploadStep();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Expenses from CSV</CardTitle>
        <CardDescription>
          Upload a CSV file with your expenses data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
} 