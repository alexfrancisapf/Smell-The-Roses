import React, { useState, useEffect, useRef, useContext } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { ArrowUpDown } from "lucide-react";
import './overview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { TripContext } from "../../context/TripContext";
import { downloadKml } from "../../utils/downloadKml";

const Overview = ({ geoJson }) => {
    const { tripData } = useContext(TripContext);
    const [activeId, setActiveId] = useState(null);
    const [attractions, setAttractions] = useState([]);
    const scrollContainerRef = useRef(null);

    // Update attractions with names from pois
    useEffect(() => {
        const updatedAttractions = tripData?.routeData.map((poi, index) => ({
            id: `${index + 1}`,
            name: poi.name || `Attraction ${index + 1}`,
        }));
        setAttractions(updatedAttractions); 
    }, [tripData]);

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        
        // Do nothing If not dragging over anything
        if (!over || active.id === over.id) {
            return;
        }

        // Prevent swapping if the active item is the first or last attraction
        const activeIndex = attractions.findIndex((item) => item.id === active.id);
        const overIndex = attractions.findIndex((item) => item.id === over.id);

        if (activeIndex === 0 || activeIndex === attractions.length - 1 || overIndex === 0 || overIndex === attractions.length - 1) {
            return; // Don't allow swapping with first or last attraction
        }

        // Swap attractions during drag
        setAttractions(arrayMove(attractions, activeIndex, overIndex));
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
    };

    const onRemove = (id) => {
        const updatedAttractions = attractions.filter(attraction => attraction.id !== id);
        setAttractions(updatedAttractions);
        console.log(`Attraction ${id} removed!`);
    };

    return (
        <DndContext 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]} // Ensure attractions stay within the container when dragged
        >
            <SortableContext items={attractions.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <div className="overview-header-container">
                    <h2 className="overview-header">Overview</h2>
                    <div className="overview-header-right">
                        <button className="sort-btn">
                            <ArrowUpDown size={27} />
                        </button>
                        <button className="export-btn" onClick={() => downloadKml(geoJson)}>
                            <FontAwesomeIcon className="export-btn-icon" icon={faDownload} />
                        </button>
                    </div>
                </div>
                <div className="overview-container">
                    <div className="overview-scroll" ref={scrollContainerRef}>
                        {attractions.map((item, index) => (
                            <Attraction
                                key={item.id} 
                                id={item.id} 
                                name={item.name}
                                isActive={item.id === activeId}
                                isDragging={item.id === activeId}
                                onRemove={onRemove}
                                isFirst={index === 0} // Check if it's the first attraction
                                isLast={index === attractions.length - 1} // Check if it's the last attraction
                            />
                        ))}
                    </div>
                </div>
            </SortableContext>
        </DndContext>
    );
};

const Attraction = ({ id, name, isDragging, onRemove, isFirst, isLast }) => {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ 
        id,
        disabled: isFirst || isLast, // Disable dragging for the first and last attraction
    });

    const style = {
        transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
        transition,
        width: '100%',
    };

    // Handle remove and stop propagation
    const handleRemoveClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onRemove(id);
    };

    // Conditionally apply styles for first and last items
    const attractionClassNames = `attraction ${isDragging ? 'dragging' : ''} 
        ${isFirst ? 'first-attraction' : ''} 
        ${isLast ? 'last-attraction' : ''}`;

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={attractionClassNames}
            style={style}
        >
            <span className="attraction-name">{name}</span>
            {/* Only show the remove button if it's not the first or last attraction */}
            {!isFirst && !isLast && (
                <button 
                    onClick={handleRemoveClick} 
                    className="remove-btn"
                    {...{ 
                        onMouseDown: e => e.stopPropagation(),
                        onTouchStart: e => e.stopPropagation(),
                        onPointerDown: e => e.stopPropagation()
                    }}
                > −
                </button>
            )}
        </div>
    );
};

export default Overview;
