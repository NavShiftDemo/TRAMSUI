import React from 'react';

export const ExpensesPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800">Fleet Expenses & Fuel</h2>
      <p className="mt-2 text-sm text-slate-500">
        Feature module: expenses
      </p>
    </div>
  );
};

export default ExpensesPage;
