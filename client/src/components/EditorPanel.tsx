import { useState } from 'react'
import { useEffect } from 'react'
import { X } from 'lucide-react'


interface EditorPanelProps {
    selectedElement: {
        tagName: string;
        className: string;
        text: string;
        styles: {
            padding: string;
            margin: string;
            backgroundColor: string;
            color: string;
            fontSize: string;

        };
    } | null;
    onUpdate: (updates: any) => void;
    onClose: () => void;
}

const EditorPanel = ({ selectedElement, onUpdate, onClose }: EditorPanelProps) => {


    const [values, setValues] = useState(selectedElement)

    useEffect(() => {
        setValues(selectedElement)
    }, [selectedElement])

    if (!selectedElement || !values) return null

    const handleChange = (field: string, value: string) => {
        const newValues = { ...values, [field]: value };
        if (field in values.styles) {
            newValues.styles = { ...values.styles, [field]: value }
        }
        setValues(newValues)
        onUpdate({ [field]: value })
    }


    const handleStyleChange = (styleName: string, value: string) => {
        const newStyles = { ...values.styles, [styleName]: value };
        setValues({ ...values, styles: newStyles });
        onUpdate({ styles: { [styleName]: value } })
    }



    return (
        <div className='fixed inset-x-0 bottom-0 z-50 lg:absolute lg:top-4 lg:right-4 lg:bottom-auto lg:w-80 bg-white rounded-t-3xl lg:rounded-lg shadow-2xl border-t lg:border border-gray-200 animate-in fade-in slide-in-from-bottom lg:slide-in-from-right-5'>
            <div className='flex justify-between items-center p-4 border-b lg:border-b-gray-100'>
                <h3 className='font-bold text-gray-900 flex items-center gap-2'>
                    <span className='size-2 rounded-full bg-indigo-500 animate-pulse'></span>
                    Edit Element
                </h3>
                <button 
                    onClick={onClose} 
                    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                    <X className='w-5 h-5 lg:w-4 lg:h-4 text-gray-500' />
                </button>
            </div>
            
            <div className='p-4 space-y-5 text-black max-h-[60vh] lg:max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar'>
                <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Text Content</label>
                    <textarea value={values.text} onChange={(e) => handleChange('text', e.target.value)} className='w-full text-sm p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none min-h-20' />
                </div>
                <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Class Name</label>
                    <input type='text' value={values.className || ''} onChange={(e) => handleChange('className', e.target.value)} className='w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ' />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block text-xs font-medium text-gray-500'>Padding</label>
                        <input type='text' value={values.styles.padding} onChange={(e) => handleStyleChange('padding', e.target.value)} className='w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ' />
                    </div>
                    <div>
                        <label className='block text-xs font-medium text-gray-500'>Margin</label>
                        <input type='text' value={values.styles.margin} onChange={(e) => handleStyleChange('margin', e.target.value)} className='w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ' />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block text-xs font-medium text-gray-500'>Font Size</label>
                        <input type='text' value={values.styles.fontSize} onChange={(e) => handleStyleChange('fontSize', e.target.value)} className='w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ' />
                    </div>



                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block text-xs font-medium text-gray-500'>Background</label>

                        <div className='flex items-center gap-2 border border-gray-400 rounded-md p-1'>
                            <input type='color' value={values.styles.backgroundColor === 'rgba(0, 0, 0, 0)' || values.styles.backgroundColor === 'transparent' ? '#ffffff' : values.styles.backgroundColor} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className='w-6 h-6 cursor-pointer ' />
                            <span className='text-xs text-gray-500'>{values.styles.backgroundColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className='block text-xs font-medium text-gray-500'>Text Color</label>

                        <div className='flex items-center gap-2 border border-gray-400 rounded-md p-1'>
                            <input type='color' value={values.styles.color} onChange={(e) => handleStyleChange('color', e.target.value)} className='w-6 h-6 cursor-pointer ' />
                            <span className='text-xs text-gray-500'>{values.styles.color}</span>
                        </div>
                    </div>



                </div>


            </div>
        </div>

    )
}

export default EditorPanel