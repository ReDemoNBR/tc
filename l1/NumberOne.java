import java.io.*;
import java.util.*;
import java.lang.Math;

public class NumberOne {
    private int[][] grafo; //    uma matriz de adjacência de aresta para um grafo
    private static int numAresta;
    private static int sizeClique;
    private static int numClique;
    private Vector primeiroClique;


    private NumberOne(String numV) {
        int n = Integer.parseInt(numV);
        grafo = new int[n][n];
        primeiroClique = new Vector();
        sizeClique = (int) Math.floor(0.5 * Math.log((double) n) / Math.log(2.0));
    }

    private void addLink(String v, String x) {
        int idxV1 = Integer.parseInt(v);
        int idxV2 = Integer.parseInt(x);
        grafo[idxV1][idxV2] = 1;
        numAresta++;
    }

    private void doCliqueBT(Vector A, int j) {
        if (j == sizeClique) {
            if (primeiroClique.isEmpty()) primeiroClique = A;
            numClique++;
            System.out.print("Vértices em um clique: ");
            for (int i = 0; i < A.size(); i++) System.out.print(A.get(i) + ", ");
            System.out.println();
        } else {
            j++;
            ArrayList Sj = new ArrayList();
            if (j <= sizeClique) Sj = getCandidates(A);
            if (!Sj.isEmpty()) for (int i = 0; i < Sj.size(); i++) doCliqueBT((Vector) Sj.get(i), j);
        }
    }

    private ArrayList getCandidates(Vector A) {
        ArrayList candidatos = new ArrayList();
        if (A.isEmpty()) for (int i = 0; i < grafo.length; i++) candidatos.add(new Vector(1).add(i));
        else {
            for (int j = ((Integer) A.lastElement()) + 1; j < grafo.length; j++) {
                boolean allConnected = true;
                Iterator iter = A.iterator();

                while (iter.hasNext()) {
                    if (!isConnected((int) iter.next(), j)) {
                        allConnected = false;
                        break;
                    }
                }
                if (allConnected) candidatos.add(new Vector(A).add(j));
            }
        }
        return candidatos;
    }

    private boolean isConnected(int i, int j) {
        return grafo[i][j] == 1;
    }

    private void printResult() {
        System.out.println("\tTotal de vértices:\t\t" + grafo.length);
        System.out.println("\tTotal de arestas:\t\t" + numAresta);
        System.out.println("\tValor de k (tamanho do clique):\t" + sizeClique);
        if (numClique == 0) System.out.println("Número de k-cliques encontrados: Nenhum clique encontrado");
        else {
            System.out.println("\tNúmero de k-cliques encontrados\t: " + numClique);
            System.out.print("\tVértices do clique encontrado pela primeira vez\t: ");
            for (int i = 0; i < primeiroClique.size(); i++) System.out.print((int) primeiroClique.get(i) + "  ");
        }
        System.out.println();
    }


    public static void main(String[] args) throws IOException {
        System.out.println("Entre com um número de vértices, e depois dois números que representam uma aresta entre dois vértices");
        System.out.println("Ex: Um gráfico de 4 vértices e D (0,1), e (0,3), e (1,2), e (2,3):");
        System.out.println("\t\t5");
        System.out.println("\t\t0 1");
        System.out.println("\t\t0 3");
        System.out.println("\t\t1 2");
        System.out.println("\t\t2 3");
        System.out.print("\nEntre com uma string que representa um grafo\n\n" + "=> ");
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        String firstLine = bufferedReader.readLine();

        StringTokenizer strToken = new StringTokenizer(firstLine);
        String numNodes = strToken.nextToken();

        NumberOne cliqueBT = new NumberOne(numNodes);

        String pair = bufferedReader.readLine();
        strToken = new StringTokenizer(pair);
        while (strToken.hasMoreTokens()) {
            if (strToken.countTokens() == 0) break;
            else {
                String from = strToken.nextToken();
                String to = strToken.nextToken();
                cliqueBT.addLink(from, to);
                if (!strToken.hasMoreTokens()) {
                    pair = bufferedReader.readLine();
                    strToken = new StringTokenizer(pair);
                }
            }
        }
        long time = System.currentTimeMillis();

        cliqueBT.doCliqueBT(new Vector(), 0);
        System.out.println("\nTempo de execução do algoritmo: " + (System.currentTimeMillis() - time) + " ms.");
        cliqueBT.printResult();
    }
}