import torch
import torch.nn as nn

class PhishGuardLSTM(nn.Module):
    
    def __init__(self, vocab_size, embed_dim, hidden_dim, output_dim):
        super().__init__()
        
        # Embedding layer
        self.embedding = nn.Embedding(vocab_size + 1, embed_dim)
        self.embedding_dropout = nn.Dropout(0.4)
        
        # LSTM layer
        self.lstm = nn.LSTM(
            embed_dim,
            hidden_dim,
            batch_first=True,
            bidirectional=True
            
        )
        
        # Dropout before FC layer
        self.fc_dropout = nn.Dropout(0.4)
        
        # Fully connected layer
        self.fc = nn.Linear(hidden_dim * 2, output_dim)
        
        # Sigmoid for binary classification
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        x = self.embedding(x)
        x = self.embedding_dropout(x)        # ← dropout after embedding

        out, (hidden, cell) = self.lstm(x)

        h_forward = hidden[-2]
        h_backward = hidden[-1]

        h = torch.cat((h_forward, h_backward), dim=1)

        h = self.fc_dropout(h)               # ← dropout before FC
        out = self.fc(h)

        return self.sigmoid(out)