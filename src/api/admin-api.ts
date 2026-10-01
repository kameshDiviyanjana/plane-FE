import authFetch from "./authfetch";

export interface UserDetail {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface PredictionDetail {
  id: number;
  userId: number | null;
  plantName: string;
  diseaseName: string;
  confidence: number;
  imageUrl: string | null;
  treatment: string | null;
  createdAt: string;
}

// Fetch all registered users
export const fetchAllUsers = async (): Promise<UserDetail[]> => {
  const response = await authFetch.get<UserDetail[]>("/users");
  return response.data;
};

// Delete a user by ID
export const deleteUserById = async (id: number): Promise<void> => {
  await authFetch.delete(`/users/${id}`);
};

// Fetch all predictions
export const fetchAllPredictions = async (): Promise<PredictionDetail[]> => {
  const response = await authFetch.get<PredictionDetail[]>("/predictions");
  return response.data;
};

// Delete a prediction by ID
export const deletePredictionById = async (id: number): Promise<void> => {
  await authFetch.delete(`/predictions/${id}`);
};
