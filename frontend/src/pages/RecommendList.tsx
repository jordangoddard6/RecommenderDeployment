import { useState, useEffect } from 'react';
import Select from 'react-select';
import Papa from 'papaparse';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define the type for the CSV data rows
interface Recommendation {
  contentId: string;
  recommendedContentId: string;
}

function RecommendList() {
  const [content, setContent] = useState<Recommendation[]>([]);
  const [collaborative, setCollaborative] = useState<Recommendation[]>([]);
  const [selectedItemID, setSelectedItemID] = useState<string | null>(null);
  const [contentRecommendations, setContentRecommendations] = useState<
    string[]
  >([]);
  const [collaborativeRecommendations, setCollaborativeRecommendations] =
    useState<string[]>([]);

  // Load and parse CSV files
  useEffect(() => {
    // Load collaborative_filtering.csv
    Papa.parse<Recommendation>('/collaborative_filtering.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const collaborativeData = result.data;
        setCollaborative(collaborativeData);

        // Extract contentIds from collaborative_filtering.csv
        const collaborativeContentIds = new Set(
          collaborativeData.map((rec) => rec.contentId)
        );

        // Load content_recommendations.csv and filter rows
        Papa.parse<Recommendation>('/content_recommendations.csv', {
          download: true,
          header: true,
          complete: (result) => {
            const filteredContent = result.data.filter((rec) =>
              collaborativeContentIds.has(rec.contentId)
            );
            setContent(filteredContent);
          },
        });
      },
    });
  }, []);

  // Handle dropdown selection
  const handleItemSelect = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSelectedItemID(selectedOption.value);

    // Find recommendations for the selected itemID
    const contentRecs = content
      .filter((rec) => rec.contentId === selectedOption.value)
      .map((rec) => rec.recommendedContentId);

    const collaborativeRecs = collaborative
      .filter((rec) => rec.contentId === selectedOption.value)
      .map((rec) => rec.recommendedContentId);

    setContentRecommendations([...contentRecs]);
    setCollaborativeRecommendations([...collaborativeRecs]);
  };

  // Prepare dropdown options (subset of itemIDs)
  const dropdownOptions = [
    ...new Set([
      ...content.map((rec) => rec.contentId),
      ...collaborative.map((rec) => rec.contentId),
    ]),
  ].map((id) => ({ value: id, label: id }));

  return (
    <>
      <label htmlFor="itemDropdown">Select ItemID: </label>
      <Select
        id="itemDropdown"
        options={dropdownOptions}
        onChange={handleItemSelect}
        placeholder="Select an ItemID"
      />
      <br />
      <h5>Content filtering recommendations</h5>
      <ul className="list-unstyled">
        {contentRecommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
      <br />
      <h5>Collaborative filtering recommendations</h5>
      <ul className="list-unstyled">
        {collaborativeRecommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </>
  );
}

export default RecommendList;
